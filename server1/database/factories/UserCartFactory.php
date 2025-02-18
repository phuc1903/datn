<?php

namespace Database\Factories;

use App\Models\Sku;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserCart>
 */
class UserCartFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'sku_id' => Sku::inRandomOrder()->first()->id,
            'quantity' => $this->faker->randomNumber(1, true),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
