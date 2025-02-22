<?php

namespace Database\Seeders;

use App\Models\Wallet;
use App\Models\HistoryMoney;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | Wallet
        |--------------------
        |
        | Hàm bổ sung:
        | - createHistory(...) : Tạo lịch sử ví
        |
        */
        Wallet::factory()
            ->count(10)
            ->createHistory(5)
            ->create();
    }
}
