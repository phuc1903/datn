<?php

namespace Database\Factories;

use App\Enums\Order\OrderItemStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\Sku;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Lấy id sku bất kỳ
        $skuId = Sku::inRandomOrder()->first()->id;

        // Lấy thông tin sku
        $sku = Sku::find($skuId);

        return [
            'order_id' => Order::inRandomOrder()->first()->id,
            'sku_id' => $skuId,
            'quantity' => $this->faker->randomNumber(1, true),
            'price' => $sku->price,
            'status' => $this->faker->randomElement(OrderItemStatus::getValues()),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
