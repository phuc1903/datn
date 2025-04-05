<?php

namespace App\Http\Controllers\Api\V1\Order;

use App\Enums\Order\OrderStatus;
use App\Enums\Product\ProductStatus;
use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Order\CreateOrderRequest;
use App\Jobs\SendCreateOrder;
use App\Models\Combo;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sku;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

        Log::info('MoMo Payment Request Payload: ' . json_encode($payload));
        Log::info('MoMo Raw Hash for Signature: ' . $rawHash);

        $client = new Client();
        try {
            $response = $client->post($config['endpoint'], [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);
            $result = json_decode($response->getBody(), true);

            Log::info('MoMo Payment Response: ' . json_encode($result));

            if ($result['resultCode'] == 0) {
                return ['paymentUrl' => $result['payUrl']];
            }

            throw new \Exception($result['message'] . ' (Result Code: ' . $result['resultCode'] . ')');
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorResponse = json_decode($e->getResponse()->getBody()->getContents(), true);
            Log::error('MoMo Payment Error: ' . json_encode($errorResponse));
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

        Log::info('MoMo Card Payment Request Payload: ' . json_encode($payload));
        Log::info('MoMo Card Raw Hash for Signature: ' . $rawHash);

        $client = new Client();
        try {
            $response = $client->post($config['endpoint'], [
                'json' => $payload,
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
            ]);
            $result = json_decode($response->getBody(), true);

            Log::info('MoMo Card Payment Response: ' . json_encode($result));

            if ($result['resultCode'] == 0) {
                return ['paymentUrl' => $result['payUrl']]; // MoMo trả về URL để nhập thẻ
            }

            throw new \Exception($result['message'] . ' (Result Code: ' . $result['resultCode'] . ')');
        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorResponse = json_decode($e->getResponse()->getBody()->getContents(), true);
            Log::error('MoMo Card Payment Error: ' . json_encode($errorResponse));
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

            // Tạo job gữi mail (đối với đơn hàng Bank)
            SendCreateOrder::dispatch(['order' => $order]);
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
    private function validateProducts(array $orders, $skus, $combos)
    {
        foreach ($orders as $order) {
            if (!isset($order['sku_id']) && !isset($order['combo_id'])) {
                throw new \Exception('Order item must have either SKU ID or Combo ID.', 400);
            }

            if (!empty($order['sku_id']) && !empty($order['combo_id'])) {
                throw new \Exception('An order item cannot have both SKU ID and Combo ID.', 400);
            }

            if (!empty($order['sku_id'])) {
                if (!isset($skus[$order['sku_id']])) {
                    throw new \Exception('Sku not found for SKU ID ' . $order['sku_id'], 400);
                }

                $sku = $skus[$order['sku_id']];
                $product = Product::find($sku->product_id);
                if (!$product || $product->status != ProductStatus::Active) {
                    throw new \Exception('Product is out of stock for SKU ID ' . $order['sku_id'], 404);
                }

                if ($sku->quantity < $order['quantity']) {
                    throw new \Exception('Not enough stock for SKU ID ' . $order['sku_id'], 400);
                }
            }

            if (!empty($order['combo_id'])) {
                if (!isset($combos[$order['combo_id']])) {
                    throw new \Exception('Combo not found for Combo ID ' . $order['combo_id'], 400);
                }

                $combo = $combos[$order['combo_id']];
                if ($combo->status != ProductStatus::Active) {
                    throw new \Exception('Combo is out of stock for Combo ID ' . $order['combo_id'], 404);
                }

                if ($combo->quantity < $order['quantity']) {
                    throw new \Exception('Not enough stock for Combo ID ' . $order['combo_id'], 400);
                }
            }
        }
    }

    private function calculateTotalAmount(array $orders, $skus, $combos)
    {
        $totalAmount = 0;
        foreach ($orders as $order) {
            if (!empty($order['sku_id'])) {
                $sku = $skus->get($order['sku_id']);
                if (!$sku) {
                    throw new \Exception("SKU not found for ID: " . $order['sku_id']);
                }
                $price = !empty($sku->promotion_price) ? $sku->promotion_price : $sku->price;
                $orderTotal = $order['quantity'] * $price;
            } elseif (!empty($order['combo_id'])) {
                $combo = $combos->get($order['combo_id']);
                if (!$combo) {
                    throw new \Exception("Combo not found for ID: " . $order['combo_id']);
                }
                $orderTotal = $order['quantity'] * $combo->price;
            } else {
                throw new \Exception("Order item must have either SKU ID or Combo ID");
            }
            $totalAmount += $orderTotal;
        }
        return $totalAmount;
    }
    private function validateVoucher(User $user, Voucher $voucher, $totalAmount)
    {
        if ($voucher->status != VoucherStatus::Active) {
            throw new \Exception('Voucher ' . $voucher->code . ' is not active', 404);
        }

        if ($voucher->quantity <= 0) {
            throw new \Exception('Voucher ' . $voucher->code . ' is out of stock', 404);
        }

        if ($totalAmount < $voucher->min_order_value) {
            throw new \Exception('Order is below minimum value for voucher ' . $voucher->code, 403);
        }

        $hasUsedVoucher = $user->orders()->where('voucher_id', $voucher->id)->exists();
        if ($hasUsedVoucher) {
            throw new \Exception('Voucher ' . $voucher->code . ' already used', 400);
        }

        $userOwnsVoucher = $user->vouchers()->where('voucher_id', $voucher->id)->exists();
        if (!$userOwnsVoucher) {
            throw new \Exception('User does not own this voucher', 403);
        }
    }


    private function applyVoucherDiscount(Voucher $voucher, $totalAmount)
    {
        $discount = ($voucher->type == VoucherType::Percent)
            ? min($totalAmount * ($voucher->discount_value / 100), $voucher->max_discount_value)
            : min($voucher->discount_value, $totalAmount);

        return max(0, $totalAmount - $discount);
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
    private function createOrderItems(Order $order, array $orderItems, $skus, $combos)
    {
        return array_map(function ($item) use ($order, $skus, $combos) {
            if (!empty($item['sku_id']) && !empty($item['combo_id'])) {
                throw new \Exception('An order item cannot have both SKU ID and Combo ID.', 400);
            }

            $sku = !empty($item['sku_id']) ? $skus->get($item['sku_id']) : null;
            $combo = !empty($item['combo_id']) ? $combos->get($item['combo_id']) : null;

            return OrderItem::create([
                'order_id' => $order->id,
                'sku_id' => $item['sku_id'] ?? null,
                'combo_id' => $item['combo_id'] ?? null,
                'quantity' => $item['quantity'],
                'price' => $sku ? (!empty($sku->promotion_price) ? $sku->promotion_price : $sku->price) : ($combo ? $combo->price : 0),
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
                $comboIds = array_column($orderData['orders'], 'combo_id');
                $skus = Sku::findMany($skuIds)->keyBy('id');
                $combos = Combo::findMany($comboIds)->keyBy('id');
                $shippingCost = 0;

                $this->validateProducts($orderData['orders'], $skus, $combos);
                $totalAmount = $this->calculateTotalAmount($orderData['orders'], $skus,$combos);

                $voucherId = $orderData['voucher_id'] ?? null;
                $voucher = $voucherId ? Voucher::find($voucherId) : null;

                if ($voucher) {
                    $this->validateVoucher($user, $voucher, $totalAmount, $orderData['orders'], $skus);
                    $totalAmountBeforeDiscount = $this->applyVoucherDiscount($voucher, $totalAmount);
                    $voucher->decrement('quantity');
                    $totalAmount = $totalAmountBeforeDiscount;
                }

                $order = Order::create([
                    'user_id' => $user->id,
                    'voucher_id' => $voucher?->id,
                    'full_name' => $orderData['first_name'] . ' ' . $orderData['last_name'],
                    'email' => $user->email,
                    'address' => $orderData['address'],
                    'province_code' => $orderData['province_code'],
                    'district_code' => $orderData['district_code'],
                    'ward_code' => $orderData['ward_code'],
                    'phone_number' => $orderData['phone_number'],
                    'payment_method' => $orderData['payment_method'],
                    'status' => ($orderData['payment_method'] == 'cod') ? OrderStatus::Pending : OrderStatus::Waiting,
                    'shipping_cost' => $shippingCost,
                    'total_amount' => $totalAmount + $shippingCost,
                    'discount_amount' => $voucher ? ($totalAmount - $totalAmountBeforeDiscount) : 0,

                    'note' => $orderData['note'] ?? null,
                    'reason' => $orderData['reason'] ?? null,
                ]);

                $orderItems = $this->createOrderItems($order, $orderData['orders'], $skus,$combos);

                // Initialize response with order data
                $response = [
                    'order' => $order,
                    'order_items' => $orderItems,
                ];

                // If payment method is bank, use Momo payment
                if ($orderData['payment_method'] == 'bank') {
                    try {
                        // Determine which Momo payment method to use based on configuration
                        $momoRequestType = config('momo.requestType');
                        if ($momoRequestType == 'payWithCC') {
                            $paymentResult = $this->createMomoCardPayment($order);
                        } else {
                            $paymentResult = $this->createMomoPayment($order);
                        }

                        // Add payment URL to response
                        $response['payment_url'] = $paymentResult['paymentUrl'];
                    } catch (\Exception $e) {
                        // Log payment error but still create order
                        Log::error('Failed to create Momo payment for order #' . $order->id . ': ' . $e->getMessage());
                        $response['payment_error'] = $e->getMessage();
                    }
                }

                // Tạo job gữi mail (đối với đơn hàng COD), đơn hàng Bank sẽ được gữi sau khi thanh toán thành công (nằm ở webhook)
                if ($orderData['payment_method'] == 'cod') {
                    SendCreateOrder::dispatch(['order' => $order]);
                }

                return $response;
            });

            return ResponseSuccess('Order created successfully!', $result, 201);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
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
            $order = Order::with([
                'items.sku' => function ($query) {
                    $query->select('id', 'product_id', 'price');
                },
                'items.sku.variantValues' => function ($query) {
                    $query->select('value');
                },
                'items.sku.product' => function ($query) {
                    $query->select('id', 'name', 'description');
                },
                'items.combo' => function ($query) {
                    $query->select('id', 'name', 'description');
                }
            ])->find($id);

            if ($order) {
                return ResponseSuccess('Order retrieved successfully.', $order, 200);
            } else {
                return ResponseError('Order not Found', null, 404);
            }
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
    public function cancelOrder(Request $request, $order_id)
    {
        try {
            // Lấy người dùng đang đăng nhập
            $user = auth()->user();

            // Tìm đơn hàng thuộc về user
            $order = Order::where('id', $order_id)->where('user_id', $user->id)->first();

            // Kiểm tra nếu đơn hàng không tồn tại
            if (!$order) {
                return ResponseError('Order not found', null, 404);
            }

            // Kiểm tra nếu đơn hàng không ở trạng thái pending
            if ($order->status !== OrderStatus::Pending) {
                return ResponseError('Only pending orders can be canceled', null, 400);
            }

            // Kiểm tra xem lý do hủy có được nhập không
            $request->validate([
                'reason' => 'required|string|max:255',
            ]);

            // Cập nhật trạng thái thành canceled và lưu lý do hủy
            Order::where('id', $order_id)->where('user_id', $user->id)->update([
                'status' => OrderStatus::Cancel,
                'reason' => $request->reason,
            ]);
            $order = Order::where('id', $order_id)->where('user_id', $user->id)->first();
            return ResponseSuccess('Order canceled successfully', $order);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
