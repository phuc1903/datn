<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\ProductImage;

class DatabaseSeeder extends Seeder
{
    /**
     * Chạy các seeders cơ sở dữ liệu.
     *
     * @return void
     */
    public function run()
    {
        // Tạo admin account
        Admin::factory()->count(2)->create();
        // Tạo danh mục
        Category::factory()->count(10)->create();

        // Tạo sản phẩm
        Product::factory()->count(20)->create();

        // Tạo mối quan hệ giữa sản phẩm và danh mục
        ProductCategory::factory()->count(30)->create();

        // Tạo hình ảnh sản phẩm
        ProductImage::factory()->count(50)->create();
    }
}
