<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVoucher>
 */
class ProductVoucherFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['product', 'category']);

        return [
            'voucher_id' => Voucher::factory(),
            'product_id' => ($type == 'product') ? Product::inRandomOrder()->first()->id : null,
            'category_id' => ($type == 'category') ? Category::inRandomOrder()->first()->id : null,
            'type' => $type,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
