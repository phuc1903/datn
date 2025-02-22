<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserVoucher>
 */
class UserVoucherFactory extends Factory
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
            'voucher_id' => Voucher::inRandomOrder()->first()->id,
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
