<?php

namespace Database\Factories;

use App\Models\SkuVariant;
use App\Models\Sku;
use App\Models\VariantValue;
use Illuminate\Database\Eloquent\Factories\Factory;

class SkuVariantFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = SkuVariant::class;

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'sku_id' => Sku::inRandomOrder()->first()->id,  // Chọn SKU ngẫu nhiên
            'variant_value_id' => VariantValue::inRandomOrder()->first()->id,  // Chọn giá trị biến thể ngẫu nhiên
        ];
    }
}
