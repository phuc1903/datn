<?php

namespace Database\Seeders;

use App\Models\ProductFeedback;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductFeedbackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | ProductFeedback
        |--------------------
        |
        | Hàm bổ sung:
        | - banned() : Đặt trang thái khóa tài khoản. (Không để tức là random)
        | - active() : Đặt trang thái mở tài khoản. (Không để tức là random)
        | - hidden() : Đặt trang thái mở tài khoản. (Không để tức là random)
        | - pending() : Đặt trang thái mở tài khoản. (Không để tức là random)
        |
        */
        ProductFeedback::factory()
            ->count(20)
            ->pending()
            ->create();
    }
}
