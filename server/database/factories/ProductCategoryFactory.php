<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductCategoryFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = ProductCategory::class;

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'product_id' => Product::inRandomOrder()->first()->id,  // Lấy sản phẩm ngẫu nhiên
            'category_id' => Category::inRandomOrder()->first()->id,  // Lấy danh mục ngẫu nhiên
        ];
    }
}
