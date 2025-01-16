<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Variant;
use App\Models\VariantValue;
use App\Models\Sku;
use App\Models\SkuVariant;

class DatabaseSeeder extends Seeder
{
    /**
     * Chạy các seeders cơ sở dữ liệu.
     *
     * @return void
     */
    public function run()
    {
        // Tạo 10 sku
        Sku::factory()->count(30)->create();

        // Tạo 20 sku_variants
        SkuVariant::factory()->count(30)->create();
    }
}
