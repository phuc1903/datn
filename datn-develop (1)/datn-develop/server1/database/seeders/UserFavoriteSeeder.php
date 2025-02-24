<?php

namespace Database\Seeders;

use App\Models\UserFavorite;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserFavoriteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | UserFavorite
        |--------------------
        */
        UserFavorite::factory()
            ->count(10)
            ->create();
    }
}
