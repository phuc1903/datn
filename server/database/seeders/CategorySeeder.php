<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | Category
        |--------------------
        |
        | Hàm bổ sung:
        | - createCategoryChilds(...) : Tạo thêm các category con.
        | - hidden() : Đặt trạng thái ẩn
        |
        */
        Category::factory()
            ->count(10)
            ->createCategoryChilds(3)
            ->create();
    }
}
