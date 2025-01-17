<?php

namespace Database\Factories;

use App\Models\ProductImage;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = ProductImage::class;

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'product_id' => Product::inRandomOrder()->first()->id,  // Lấy sản phẩm ngẫu nhiên
            'image_url' => 'https://placehold.co/640x480.png/00cc44?text=cum',  // Lấy ảnh ngẫu nhiên từ Faker
        ];
    }
}
