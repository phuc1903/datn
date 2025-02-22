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
        |
        */
        Category::factory()
            ->count(5)
            ->createCategoryChilds(2)
            ->create();
    }
}
