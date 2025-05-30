<?php

namespace Database\Seeders;

use App\Models\UserAddress;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /*
        |--------------------
        | UserAddress
        |--------------------
        */
        UserAddress::factory()
            ->count(10)
            ->create();
    }
}
