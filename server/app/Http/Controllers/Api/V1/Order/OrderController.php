<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Product\ProductStatus;
use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Order\CreateOrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sku;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class OrderController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Tạo đơn hàng
    | Path: api/v1/orders
    |--------------------------------------------------------------------------
    */
    private function validateProducts(array $orders, $skus)
    {
        foreach ($orders as $order) {
            $sku = $skus->get($order['sku_id']);
            $product = Product::find($sku->product_id);

            if (!$sku) {
                throw new \Exception('Sku not found for SKU ID ' . $order['sku_id'], 400);
            }

            if ($product->status != ProductStatus::Active) {
                throw new \Exception('Product is out of stock for SKU ID ' . $order['sku_id'], 404);
            }

            if ($sku->quantity < $order['quantity']) {
                throw new \Exception('Not enough stock for SKU ID ' . $order['sku_id'], 400);
            }
        }
    }
    private function calculateTotalAmount(array $orders, $skus)
    {
        $totalAmount = 0;
        foreach ($orders as $order) {
            // Lấy SKU tương ứng từ mảng $skus
            $sku = $skus->get($order['sku_id']);

            // Kiểm tra xem SKU có tồn tại không (đảm bảo không lỗi nếu không tìm thấy)
            if (!$sku) {
                // Nếu SKU không tồn tại, log lỗi hoặc thông báo lỗi tại đây
                throw new \Exception("SKU không tồn tại với ID: " . $order['sku_id']);
            }

            // Lấy giá (giá giảm giá nếu có, nếu không thì lấy giá gốc)
            $price = empty($sku->promotion_price) ? $sku->price : $sku->promotion_price;

            // Tính toán tổng tiền cho đơn hàng hiện tại
            $orderTotal = $order['quantity'] * $price;

            // Cộng dồn vào tổng tiền
            $totalAmount += $orderTotal;
        }
        return $totalAmount;
    }
    private function validateVouchers(User $user, Collection $vouchers, $totalAmount, array $orders, $skus)
    {
        foreach ($vouchers as $voucher) {
            if ($voucher->status != VoucherStatus::Active) {
                throw new \Exception('Voucher ' . $voucher->code . ' is not active', 404);
            }

            if ($voucher->quantity <= 0) {
                throw new \Exception('Voucher ' . $voucher->code . ' is out of stock', 404);
            }

            if ($totalAmount < $voucher->min_order_value) {
                throw new \Exception('Order is below minimum value for voucher ' . $voucher->code, 403);
            }

            // Kiểm tra xem voucher đã được sử dụng chưa
            $hasUsedVoucher = $user->orders()->whereHas('vouchers', function ($query) use ($voucher) {
                $query->where('voucher_id', $voucher->id);
            })->exists();

            if ($hasUsedVoucher) {
                throw new \Exception('Voucher ' . $voucher->code . ' already used', 400);
            }
        }
    }

    private function applyVoucherDiscount(Collection $vouchers, $totalAmount, array $orders, $skus)
    {
        $discountAmount = 0;

        foreach ($vouchers as $voucher) {
            $eligibleAmount = 0;

            foreach ($orders as $order) {
                $sku = $skus->get($order['sku_id']);
                $product = Product::find($sku->product_id);
                $price = empty($sku->promotion_price) ? $sku->price : $sku->promotion_price;
                $orderTotal = $order['quantity'] * $price;

                // Chỉ áp dụng giảm giá nếu voucher hợp lệ với sản phẩm
                if ($voucher->product_id && $voucher->product_id != $sku->product_id) {
                    continue;
                }

                if ($voucher->category_id && !$product->categories->contains($voucher->category_id)) {
                    continue;
                }

                $eligibleAmount += $orderTotal;
            }

            // Tính giảm giá theo loại voucher
            if ($voucher->type == VoucherType::Percent) {
                $discount = $eligibleAmount * ($voucher->discount_value / 100);
                $discount = min($discount, $voucher->max_discount_value);
            } elseif ($voucher->type == VoucherType::Price) {
                $discount = min($voucher->discount_value, $eligibleAmount);
            }

            $discountAmount += $discount;
        }

        return max(0, $totalAmount - $discountAmount);
    }

    private function createOrderRecord(User $user, array $orderData, $totalAmount, $shippingCost)
    {
        return Order::create([
            'user_id' => $user->id,
            'full_name' => $user->last_name . ' ' . $user->first_name,
            'email' => $user->email,
            'address' => $orderData['address'],
            'phone_number' => $orderData['phone_number'],
            'payment_method' => $orderData['payment_method'],
            'status' => OrderStatus::Pending,
            'shipping_cost' => $shippingCost,
            'total_amount' => $totalAmount + $shippingCost,
            'note' => $orderData['note'] ?? null
        ]);
    }
    private function createOrderItems(Order $order, array $orderItems, $skus)
    {
        return array_map(function ($item) use ($order, $skus) {
            $sku = $skus->get($item['sku_id']);
            return OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $sku->product_id,
                'sku_id' => $item['sku_id'],
                'quantity' => $item['quantity'],
                'price' => empty($sku->promotion_price) ? $sku->price : $sku->promotion_price,
            ]);
        }, $orderItems);
    }
    private function attachVouchersToOrder(Order $order, Collection $vouchers, $totalAmount)
    {
        foreach ($vouchers as $voucher) {
            $discount = $voucher->type == VoucherType::Percent
                ? $totalAmount * ($voucher->discount_value / 100)
                : min($voucher->discount_value, $totalAmount);

            $order->vouchers()->attach($voucher->id, [
                'discount' => $discount,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function createOrder(CreateOrderRequest $request)
    {
        try {
            $user = auth()->user();
            $orderData = $request->all();

            $result = DB::transaction(function () use ($orderData, $user) {
                $skuIds = array_column($orderData['orders'], 'sku_id');
                $skus = Sku::findMany($skuIds)->keyBy('id');
                $shippingCost = 0;

                // Validate sản phẩm
                $this->validateProducts($orderData['orders'], $skus);

                // Tính tổng tiền trước khi áp dụng voucher
                $totalAmount = $this->calculateTotalAmount($orderData['orders'], $skus);

                // Lấy danh sách voucher từ request
                $voucherIds = $orderData['voucher_ids'] ?? [];
                $vouchers = Voucher::whereIn('id', $voucherIds)->get();

                // Kiểm tra và áp dụng voucher
                if ($vouchers->isNotEmpty()) {
                    $this->validateVouchers($user, $vouchers, $totalAmount, $orderData['orders'], $skus);
                    $totalAmount = $this->applyVoucherDiscount($vouchers, $totalAmount, $orderData['orders'], $skus);

                    // Giảm số lượng voucher
                    foreach ($vouchers as $voucher) {
                        $voucher->decrement('quantity');
                    }
                }

                // Tạo hóa đơn
                $order = $this->createOrderRecord($user, $orderData, $totalAmount, $shippingCost);

                // Tạo hóa đơn chi tiết
                $orderItems = $this->createOrderItems($order, $orderData['orders'], $skus);

                // Gắn voucher vào đơn hàng nếu có
                if ($vouchers->isNotEmpty()) {
                    $this->attachVouchersToOrder($order, $vouchers, $totalAmount);
                }

                return [
                    'order' => $order,
                    'order_items' => $orderItems
                ];
            });

            return ResponseSuccess('Order created successfully!', $result, 201);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, (int)($e->getCode() ?: 500));
        }
    }


    public function orderUserDetail($id): JsonResponse
    {
        try {
            $order = Order::with('items')
                ->find($id); // Load các sản phẩm trong đơn hàng;
            if ($order) {
                return ResponseSuccess('Order retrieved successfully.', $order, 200);
            } else {
                return ResponseError('Order not Found', null, 404);
            }
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
