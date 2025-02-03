<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | Admin
        |--------------------
        |
        | Hàm bổ sung:
        | - banned() : Đặt trang thái khóa tài khoản. (Không để tức là random)
        | - active() : Đặt trang thái mở tài khoản. (Không để tức là random)
        |
        */
        Admin::factory()
            ->count(5)
            ->create();
    }
}
