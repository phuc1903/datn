<?php

namespace Database\Factories;

use App\Models\HistoryMoney;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wallet>
 */
class WalletFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Lấy danh sách người dùng đã có ví
        $usedUserIds = Wallet::pluck('user_id')->toArray();

        // Lấy người dùng chưa có ví
        $user = User::whereNotIn('id', $usedUserIds)->inRandomOrder()->first();

        // Nếu trùng id thì tạo User mới và lấy id mới
        if (User::find($user->id)) {
            $user = User::factory()->create();
        }

        return [
            'user_id' => $user->id,
            'balance' => $this->faker->numberBetween(0, 2500000),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function createHistory(int $count = 1)
    {
        return $this->afterCreating(function (Wallet $wallet) use ($count) {
            $currentBalance = $wallet->balance;

            // Tạo giao dịch đầu tiên nếu chưa có lịch sử giao dịch
            if (!HistoryMoney::where('wallet_id', $wallet->id)->exists()) {
                $initialAmount = $this->faker->numberBetween(0, $currentBalance);
                HistoryMoney::create([
                    'wallet_id' => $wallet->id,
                    'before' => 0,
                    'amount' => $initialAmount,
                    'after' => $initialAmount,
                    'note' => 'Tạo giao dịch đầu tiên (nạp tiền vào ví)',
                    'type' => 'deposit',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $currentBalance = $initialAmount; // Cập nhật số dư
            }

            // Tạo các giao dịch tiếp theo
            for ($i = 0; $i < $count; $i++) {
                $type = $this->faker->randomElement(['deposit', 'withdraw', 'shopping']);
                $amount = $this->faker->numberBetween(10000, 250000);

                // Tính toán số dư trước và sau
                if ($type === 'deposit') {
                    $after = $currentBalance + $amount;
                    $note = 'Nạp tiền vào ví';
                } else {
                    // Hạn chế rút tiền/mua hàng nếu số dư không đủ
                    $amount = min($amount, $currentBalance);
                    $after = $currentBalance - $amount;
                    $note = $type === 'withdraw' ? 'Rút tiền từ ví' : 'Mua sắm hàng hóa';
                }

                // Tạo lịch sử giao dịch
                HistoryMoney::create([
                    'wallet_id' => $wallet->id,
                    'before' => $currentBalance,
                    'amount' => $amount,
                    'after' => $after,
                    'note' => $note,
                    'type' => $type,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Cập nhật số dư hiện tại
                $currentBalance = $after;
            }

            // Cập nhật lại số dư cuối của ví để đồng bộ wallet
            $wallet->update(['balance' => $currentBalance]);
        });
    }
}
