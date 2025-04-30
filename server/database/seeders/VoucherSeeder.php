<?php

namespace Database\Seeders;

use App\Models\Voucher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | Voucher
        |--------------------
        |
        | Hàm bổ sung:
        | - createProductVoutcher($count) : Tạo voucher dành riêng
        | cho 'product' hoặc 'category'
        |
        */
        Voucher::factory()
            ->count(20)
            ->create();
    }
}
