<?php

namespace Database\Factories;

use App\Enums\Product\ProductFeedbackStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductFeedback;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductFeedback>
 */
class ProductFeedbackFactory extends Factory
{
    protected $model = ProductFeedback::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sku_id' => Product::inRandomOrder()->first()->id,
            'user_id' => User::inRandomOrder()->first()->id,
            'order_id' => Order::inRandomOrder()->first()->id,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(ProductFeedbackStatus::getValues()),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    /**
     * Đặt trạng thái banned.
     */
    public function banned()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'banned',
            ];
        });
    }

    /**
     * Đặt trạng thái banned.
     */
    public function pending()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
            ];
        });
    }

    /**
     * Đặt trạng thái banned.
     */
    public function hidden()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'hidden',
            ];
        });
    }

    /**
     * Đặt trạng thái banned.
     */
    public function active()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'active',
            ];
        });
    }
}
