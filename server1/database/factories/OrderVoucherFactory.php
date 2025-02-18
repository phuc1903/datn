<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderVoucher>
 */
class OrderVoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Voucher id áp dụng
        $voucher_id = Voucher::inRandomOrder()->first()->id;

        // Áp dụng giảm tối đa voucher cho hóa đơn
        $max_discount_value = Voucher::find($voucher_id)->max_discount_value;

        return [
            'order_id' => Order::inRandomOrder()->first()->id,
            'voucher_id' => $voucher_id,
            'discount' => $max_discount_value,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
