<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Admin;  // Đảm bảo rằng Admin model đã được import
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'admin_id' => Admin::inRandomOrder()->first()->id,  // Lấy admin_id ngẫu nhiên từ bảng admins
            'name' => $this->faker->word(),
            'slug' => $this->faker->slug(),
            'short_description' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'status' => $this->faker->randomElement(['active', 'archived', 'out_of_stock']),
        ];
    }
}
