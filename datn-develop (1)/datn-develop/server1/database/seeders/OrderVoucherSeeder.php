<?php

namespace Database\Seeders;

use App\Models\OrderVoucher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderVoucherSeeder extends Seeder
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
        */
        OrderVoucher::factory()
            ->count(5)
            ->create();
    }
}
