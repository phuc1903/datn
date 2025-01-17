<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = Category::class;

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'short_description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['active', 'hidden']),
            'parent_id' => $this->faker->randomElement([0, 1]),  // Có thể là 0 hoặc là một parent_id hợp lệ
            'slug' => $this->faker->slug(),
        ];
    }
}
