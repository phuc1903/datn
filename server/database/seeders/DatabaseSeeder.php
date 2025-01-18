<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Chạy các seeders cơ sở dữ liệu.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            AdminSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            TagSeeder::class,

            VariantSeeder::class,
            ProductSeeder::class,
            ProductImageSeeder::class,
            ProductFeedbackSeeder::class,
            ProductTagSeeder::class,
            ProductCategorySeeder::class,
        ]);
    }
}
