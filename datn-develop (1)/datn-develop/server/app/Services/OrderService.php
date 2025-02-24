<?php

namespace App\Services;

use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Voucher;
use App\Models\Sku;
use App\Models\Product;
use App\Enums\Order\OrderStatus;
use App\Enums\Product\ProductStatus;
use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;

class OrderService
{
    public function validateProducts(array $orders, $skus)
    {
        foreach ($orders as $order) {
            $sku = $skus->get($order['sku_id']);
            if (!$sku) {
                throw new \Exception('Sku not found for SKU ID ' . $order['sku_id'], 400);
            }

            $product = Product::find($sku->product_id);
            if ($product->status != ProductStatus::Active) {
                throw new \Exception('Product is out of stock for SKU ID ' . $order['sku_id'], 404);
            }

            if ($sku->quantity < $order['quantity']) {
                throw new \Exception('Not enough stock for SKU ID ' . $order['sku_id'], 400);
            }
        }
    }

    public function calculateTotalAmount(array $orders, $skus)
    {
        $totalAmount = 0;
        foreach ($orders as $order) {
            $sku = $skus->get($order['sku_id']);
            if (!$sku) {
                throw new \Exception("SKU không tồn tại với ID: " . $order['sku_id']);
            }

            $price = empty($sku->promotion_price) ? $sku->price : $sku->promotion_price;
            $totalAmount += $order['quantity'] * $price;
        }
        return $totalAmount;
    }

    public function validateVouchers(User $user, Collection $vouchers, $totalAmount)
    {
        $voucherIds = $vouchers->pluck('id')->toArray();
        $existingVouchers = Voucher::whereIn('id', $voucherIds)->get()->keyBy('id');

        $userVoucherIds = DB::table('user_vouchers')
            ->where('user_id', $user->id)
            ->whereIn('voucher_id', $voucherIds)
            ->pluck('voucher_id')
            ->toArray();

        foreach ($voucherIds as $voucherId) {
            if (!isset($existingVouchers[$voucherId])) {
                throw new \Exception('Voucher ID ' . $voucherId . ' does not exist', 404);
            }

            $voucher = $existingVouchers[$voucherId];

            if (!in_array($voucherId, $userVoucherIds)) {
                throw new \Exception('Voucher ' . $voucher->code . ' does not belong to this user', 403);
            }

            if ($voucher->status != VoucherStatus::Active) {
                throw new \Exception('Voucher ' . $voucher->code . ' is not active', 404);
            }

            if ($voucher->quantity <= 0) {
                throw new \Exception('Voucher ' . $voucher->code . ' is out of stock', 404);
            }

            if ($totalAmount < $voucher->min_order_value) {
                throw new \Exception('Order is below minimum value for voucher ' . $voucher->code, 403);
            }

            $hasUsedVoucher = $user->orders()->whereHas('vouchers', function ($query) use ($voucher) {
                $query->where('voucher_id', $voucher->id);
            })->exists();

            if ($hasUsedVoucher) {
                throw new \Exception('Voucher ' . $voucher->code . ' already used', 400);
            }
        }
    }

    public function applyVoucherDiscount(Collection $vouchers, $totalAmount, array $orders, $skus)
    {
        $discountAmount = 0;

        foreach ($vouchers as $voucher) {
            $eligibleAmount = 0;

            foreach ($orders as $order) {
                $sku = $skus->get($order['sku_id']);
                $product = Product::find($sku->product_id);
                $price = empty($sku->promotion_price) ? $sku->price : $sku->promotion_price;
                $orderTotal = $order['quantity'] * $price;

                if ($voucher->product_id && $voucher->product_id != $sku->product_id) {
                    continue;
                }

                if ($voucher->category_id && !$product->categories->contains($voucher->category_id)) {
                    continue;
                }

                $eligibleAmount += $orderTotal;
            }

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
}
