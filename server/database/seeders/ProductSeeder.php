<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        /*
        |--------------------
        | Product
        |--------------------
        |
        | Tùy chỉnh số lượng CHI TIẾT SẢN PHẨM và BIẾN THỂ
        | trong file ProductFactory thông qua các biến COUNT_SKU và COUNT_VARIANT.
        | Nếu trả về giá trị 0, số lượng sẽ được tạo ngẫu nhiên.
        |
        */
        Product::factory()
            ->count(60)
            ->create();
    }
}
