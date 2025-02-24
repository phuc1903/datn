<?php

namespace Database\Factories;

use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Sku;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(OrderStatus::getValues());
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'full_name' => $this->faker->userName(),
            'email' => $this->faker->unique()->userName . '@gmail.com',
            'address' => $this->faker->address(),
            'phone_number' => $this->faker->phoneNumber(),
            'payment_method' => $this->faker->randomElement(OrderPaymentMethod::getValues()),
            'status' => $status,
            'shipping_cost' => $this->faker->randomElement([0, 10000]),
            'total_amount' => 0,
            'note' => $this->faker->sentence(),
            'reason' => $status === 'cancel' ? $this->faker->sentence() : '',
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function createOrderItems(int $count = 2)
    {
        return $this->afterCreating(function (Order $order) use ($count) {
            $orderDetails = OrderItem::factory()
                ->count($count)
                ->create([
                    'order_id' => $order->id,
                    'product_id' => Product::inRandomOrder()->first()->id,
                    'sku_id' => Sku::inRandomOrder()->first()->id,
                ]);

            $totalAmount = $orderDetails->sum(function ($orderItem) {
                return $orderItem->quantity * $orderItem->price;
            });

            $order->update([
                'total_amount' => $totalAmount + $order->shipping_cost
            ]);
        });
    }
}
