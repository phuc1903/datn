<?php

namespace Database\Factories;

use App\Models\Sku;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkuFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = Sku::class;

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'sku_code' => $this->faker->unique()->bothify('???-###'),  // Mã SKU duy nhất
            'product_id' => Product::inRandomOrder()->first()->id,  // Lấy product_id ngẫu nhiên từ bảng products
            'price' => $this->faker->numberBetween(100000, 1000000),  // Giá ngẫu nhiên
            'promotion_price' => $this->faker->numberBetween(50000, 1000000),  // Giá khuyến mãi ngẫu nhiên
            'quantity' => $this->faker->numberBetween(1, 100),  // Số lượng ngẫu nhiên
            'image_url' => $this->faker->imageUrl(),  // Địa chỉ ảnh ngẫu nhiên
        ];
    }
}
