<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\BlogProduct;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\UserFavorite;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Chạy các seeders cơ sở dữ liệu.
     *
     * @return void
     */
    public function run()
    {
        /*
        |--------------------
        | Admin (mặc định)
        |--------------------
        |
        | Tài khoản:
        | - admin@gmail.com
        | - admin
        |
        */
        Admin::create([
            'first_name' => 'Trọng Phúc',
            'last_name' => 'Đinh',
            'phone_number' => '037746234',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('123456'),
            'status' => 'active',
            'sex' => 'male',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        /*
        |--------------------
        | User (mặc định)
        |--------------------
        |
        | Tài khoản:
        | - user@gmail.com
        | - user
        |
        */
         User::factory()->create([
             'first_name' => 'Hữu Hiệp',
             'last_name' => 'Trần',
             'phone_number' => '(+84) 1234-5678',
             'email' => 'admin@gmail.com',
             'password' => bcrypt('user'),
             'status' => 'active',
             'sex' => 'male',
             'created_at' => now(),
             'updated_at' => now()
         ]);

        /*
        |--------------------
        | Tạo các seeders khác
        |--------------------
         */
         $this->call([
            AdminSeeder::class,
            UserSeeder::class,
            WalletSeeder::class,
             CategorySeeder::class,
             TagSeeder::class,

             VariantSeeder::class,
             ProductSeeder::class,
             ProductImageSeeder::class,
             ProductTagSeeder::class,
             ProductCategorySeeder::class,

            OrderSeeder::class,
            ProductFeedbackSeeder::class,
             VoucherSeeder::class,
             UserVoucherSeeder::class,
            OrderVoucherSeeder::class,

            UserAddressSeeder::class,
            UserFavoriteSeeder::class,
            UserCartSeeder::class,

            BlogSeeder::class,
            BlogTagSeeder::class,
            BlogProductSeeder::class,

            SliderSeeder::class,
         ]);
    }
}
