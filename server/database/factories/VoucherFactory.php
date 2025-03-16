<?php

namespace Database\Factories;

use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Admin;
use App\Models\ProductVoucher;
use App\Models\Voucher;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Voucher>
 */
class VoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Loại giảm giá (phần trăm / tiền cố định)
        $type = $this->faker->randomElement(VoucherType::getValues());

        // Giảm theo phân trăm (5% - 20%), ngược lại giảm cố định (10.000 - 50.000)
        $discount = ($type == 'percent') ? $this->faker->numberBetween(5, 20) : $this->faker->numberBetween(10000, 50000);

        // Giảm giá tối đa, phần trăm (10.000 hoặc 30.000 hoặc 50.000), cố định bằng với $discount
        $max_discount_value = ($type == 'percent') ? $this->faker->randomElement([10000, 30000, 50000]) : $discount;

        
        return [
            'admin_id' => Admin::inRandomOrder()->first()->id,
            'title' => $this->faker->sentence(2, true),
            'description' => $this->faker->sentence(),
            'quantity' => $this->faker->numberBetween(2, 15),
            'type' =>  $type,
            'discount_value' => $discount,
            'max_discount_value' => $max_discount_value,
            'min_order_value' => $this->faker->randomElement([10000, 30000, 50000, 100000, 500000, 1000000]),
            'status' => $this->faker->randomElement(VoucherStatus::getValues()),
            'started_date' => now(),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function createProductVoutcher(int $count = 2)
    {
        return $this->afterCreating(function (Voucher $voucher) use ($count) {
            ProductVoucher::factory()->count($count)->create([
                'voucher_id' => $voucher->id
            ]);
        });
    }


    /**
     * Đặt trạng thái active.
     */
    public function active()
    {
        return $this->state(function () {
            return [
                'status' => 'active',
            ];
        });
    }


    /**
     * Đặt trạng thái ẩn.
     */
    public function hidden()
    {
        return $this->state(function () {
            return [
                'status' => 'hidden',
            ];
        });
    }
}
