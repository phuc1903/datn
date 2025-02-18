<?php

namespace Database\Seeders;

use App\Models\BlogProduct;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BlogProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | BlogProduct
        |--------------------
        */
        BlogProduct::factory()
            ->count(20)
            ->create();
    }
}
