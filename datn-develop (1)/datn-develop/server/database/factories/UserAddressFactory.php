<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
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
            'city' => $this->faker->city(),
            'district' => $this->faker->state(),
            'ward' => $this->faker->streetName(),
            'address' => $this->faker->address(),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
