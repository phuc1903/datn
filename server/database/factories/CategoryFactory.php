<?php

namespace Database\Factories;

use App\Enums\Category\CategoryStatus;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

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
        // Tên category & slug
        $name = $this->faker->words(3, true);

        return [
            'name' => $name,
            'short_description' => $this->faker->sentence(),
            'image' => $this->faker->imageUrl(640, 480),
            'status' => $this->faker->randomElement(CategoryStatus::getValues()),
            'parent_id' => 0,
            'slug' => Str::slug($name),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function createCategoryChilds(int $count = 2)
    {
        return $this->afterCreating(function (Category $category) use ($count) {
            Category::factory()->count($count)->create(['parent_id' => $category->id]);
        });
    }
}
