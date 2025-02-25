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
use GuzzleHttp\Client;
use Illuminate\Http\Request;

class OrderController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | THANH TOÁN MOMO
    |--------------------------------------------------------------------------
    */
    private function createMomoPayment(Order $order)
    {
        $config = config('momo');

        // Tạo orderId duy nhất bằng cách kết hợp order->id và timestamp
        $orderId = (string) $order->id . '-' . time(); // Ví dụ: "8-1740510800"
        $amount = (int) $order->total_amount;
        $requestId = (string) time(); // requestId cũng nên duy nhất
        $orderInfo = "Thanh toan don hang #{$order->id}";
        $extraData = base64_encode(json_encode(['order_type' => 'online_payment']));

        // Kiểm tra trạng thái đơn hàng trước khi gửi
        if ($order->status === OrderStatus::Pending) {
            throw new \Exception('Đơn hàng đã được thanh toán trước đó.' . $order->id);
        }

        $rawHash = "accessKey={$config['access_key']}&amount={$amount}&extraData={$extraData}&ipnUrl={$config['ipn_url']}&orderId={$orderId}&orderInfo={$orderInfo}&partnerCode={$config['partner_code']}&redirectUrl={$config['redirect_url']}&requestId={$requestId}&requestType=captureWallet";
        $signature = hash_hmac("sha256", $rawHash, $config['secret_key']);

        $payload = [
            'partnerCode' => $config['partner_code'],
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $config['redirect_url'],
            'ipnUrl' => $config['ipn_url'],
            'requestType' => 'captureWallet',
            'extraData' => $extraData,
            'signature' => $signature,
            'lang' => 'vi',
        ];

        \Log::info('MoMo Payment Request Payload: ' . json_encode($payload));
        \Log::info('MoMo Raw Hash for Signature: ' . $rawHash);

        $client = new Client();
        try {
            $response = $client->post($config['endpoint'], [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);
            $result = json_decode($response->getBody(), true);

            \Log::info('MoMo Payment Response: ' . json_encode($result));

            if ($result['resultCode'] == 0) {
                return ['paymentUrl' => $result['payUrl']];
            }

            throw new \Exception($result['message'] . ' (Result Code: ' . $result['resultCode'] . ')');
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorResponse = json_decode($e->getResponse()->getBody()->getContents(), true);
            \Log::error('MoMo Payment Error: ' . json_encode($errorResponse));
            throw new \Exception($errorResponse['message'] ?? 'Unknown error from MoMo');
        }
    }

    private function createMomoCardPayment(Order $order)
    {
        $config = config('momo');
        $orderId = (string) $order->id . '-' . time();
        $amount = (int) $order->total_amount;
        $requestId = (string) time();
        $orderInfo = "Thanh toan don hang #{$order->id}";
        $extraData = base64_encode(json_encode(['order_type' => 'card_payment']));

        // Chuỗi rawHash cho thẻ, thêm requestType=payWithCC
        $rawHash = "accessKey={$config['access_key']}&amount={$amount}&extraData={$extraData}&ipnUrl={$config['ipn_url']}&orderId={$orderId}&orderInfo={$orderInfo}&partnerCode={$config['partner_code']}&redirectUrl={$config['redirect_url']}&requestId={$requestId}&requestType=payWithCC";
        $signature = hash_hmac("sha256", $rawHash, $config['secret_key']);

        $payload = [
            'partnerCode' => $config['partner_code'],
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $config['redirect_url'],
            'ipnUrl' => $config['ipn_url'],
            'requestType' => 'payWithCC', // Dùng payWithCC thay vì captureWallet
            'extraData' => $extraData,
            'signature' => $signature,
            'lang' => 'vi',
        ];

        \Log::info('MoMo Card Payment Request Payload: ' . json_encode($payload));
        \Log::info('MoMo Card Raw Hash for Signature: ' . $rawHash);

        $client = new Client();
        try {
            $response = $client->post($config['endpoint'], [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);
            $result = json_decode($response->getBody(), true);

            \Log::info('MoMo Card Payment Response: ' . json_encode($result));

            if ($result['resultCode'] == 0) {
                return ['paymentUrl' => $result['payUrl']]; // MoMo trả về URL để nhập thẻ
            }

            throw new \Exception($result['message'] . ' (Result Code: ' . $result['resultCode'] . ')');
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorResponse = json_decode($e->getResponse()->getBody()->getContents(), true);
            \Log::error('MoMo Card Payment Error: ' . json_encode($errorResponse));
            throw new \Exception($errorResponse['message'] ?? 'Unknown error from MoMo');
        }
    }

    private function handleMomoCallback(array $data)
    {
        $config = config('momo');
        $rawHash = "accessKey={$config['access_key']}&amount={$data['amount']}&extraData={$data['extraData']}&message={$data['message']}&orderId={$data['orderId']}&orderInfo={$data['orderInfo']}&orderType={$data['orderType']}&partnerCode={$data['partnerCode']}&payType={$data['payType']}&requestId={$data['requestId']}&responseTime={$data['responseTime']}&resultCode={$data['resultCode']}&transId={$data['transId']}";
        $signature = hash_hmac("sha256", $rawHash, $config['secret_key']);

        if ($signature !== $data['signature']) {
            return false;
        }

        $order = Order::find($data['orderId']);
        if ($order) {
            if ($data['resultCode'] == 0) {
                $order->status = OrderStatus::Pending;
            } else {
                $order->status = OrderStatus::Cancel;
                $order->reason = $data['message'];
            }
            $order->save();
            return true;
        }

        return false;
    }

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

    private function createOrderRecord(User $user, array $orderData, $totalAmount, $shippingCost, $paymentMethod = 'cod')
    {
        return Order::create([
            'user_id' => $user->id,
            'full_name' => $user->last_name . ' ' . $user->first_name,
            'email' => $user->email,
            'address' => $orderData['address'],
            'phone_number' => $orderData['phone_number'],
            'payment_method' => $orderData['payment_method'],
            'status' => ($paymentMethod == 'cod') ? OrderStatus::Pending : OrderStatus::Waiting,
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
                $order = $this->createOrderRecord($user, $orderData, $totalAmount, $shippingCost, $orderData['payment_method']);

                // Tạo hóa đơn chi tiết
                $orderItems = $this->createOrderItems($order, $orderData['orders'], $skus);

                // Gắn voucher vào đơn hàng nếu có
                if ($vouchers->isNotEmpty()) {
                    $this->attachVouchersToOrder($order, $vouchers, $totalAmount);
                }

                $paymentResult = null;
                if ($orderData['payment_method'] === 'bank') {
                    if (config('momo.requestType') == 'payWithCC') {
                        // Thanh toán momo VISA
                        $paymentResult = $this->createMomoCardPayment($order);
                    } else {
                        // Thánh toán momo QR
                        $paymentResult = $this->createMomoPayment($order);
                    }
                }

                return [
                    'order' => $order,
                    'order_items' => $orderItems,
                    'payment_url' => $paymentResult['paymentUrl'] ?? null
                ];
            });

            return ResponseSuccess('Order created successfully!', $result, 201);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, (int)($e->getCode() ?: 500));
        }
    }

    public function handleMomoIpn(Request $request)
    {
        try {
            $success = $this->handleMomoCallback($request->all());
            return response()->json(['success' => $success]);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
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
