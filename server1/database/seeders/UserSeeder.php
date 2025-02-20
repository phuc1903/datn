<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | User
        |--------------------
        |
        | Hàm bổ sung:
        | - banned() : Đặt trang thái khóa tài khoản. (Không để tức là random)
        | - active() : Đặt trang thái mở tài khoản. (Không để tức là random)
        |
        */
        User::factory()
            ->count(30)
            ->create();
    }
}
