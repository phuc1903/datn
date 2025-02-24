<?php

namespace Database\Factories;

use App\Enums\Wallet\HistoryMoneysType;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class HistoryMoneyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'wallet_id' => Wallet::inRandomOrder()->first()->id,
            'before' => $this->faker->numberBetween(100000, 2500000),
            'amount' => $this->faker->numberBetween(100000, 2500000),
            'after' => $this->faker->numberBetween(100000, 2500000),
            'note' => $this->faker->sentence(),
            'type' => $this->faker->randomElement(HistoryMoneysType::getValues()),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
