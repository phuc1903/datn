<?php

namespace Database\Seeders;

use App\Models\UserVoucher;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserVoucherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | UserVoucher
        |--------------------
        */
        UserVoucher::factory()
            ->count(10)
            ->create();
    }
}
