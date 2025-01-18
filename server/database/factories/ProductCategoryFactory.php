<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductCategory>
 */
class ProductCategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()->id,
            'category_id' => Category::inRandomOrder()->first()->id
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (ProductCategory $productCategory) {
            /*
            * Kiểm tra nếu danh mục được tạo là danh mục con (category_id có parent_id khác 0),
            * thì tự động thêm bản ghi cho danh mục cha tương ứng.
            */
            $category = Category::find($productCategory->category_id);

            if ($category && $category->parent_id != 0) {
                // Tạo bản ghi ProductCategory mới cho danh mục cha.
                ProductCategory::factory()->create([
                    'product_id' => $productCategory->product_id,
                    'category_id' => $category->parent_id
                ]);
            }
        });
    }
}
