<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\BlogProduct;
use App\Models\User;
use App\Models\UserAddress;
use App\Models\UserFavorite;
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
        Admin::factory()->create([
            'first_name' => 'Hữu Hiệp',
            'last_name' => 'Trần',
            'phone_number' => '(+84) 1234-5678',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('admin'),
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
            CategorySeeder::class,
            TagSeeder::class,

            VariantSeeder::class,
            ProductSeeder::class,
            ProductImageSeeder::class,
            ProductFeedbackSeeder::class,
            ProductTagSeeder::class,
            ProductCategorySeeder::class,

            OrderSeeder::class,
            VoucherSeeder::class,
            UserVoucherSeeder::class,
            OrderVoucherSeeder::class,

            WalletSeeder::class,
            UserAddressSeeder::class,
            UserFavoriteSeeder::class,
            UserCartSeeder::class,

            BlogSeeder::class,
            BlogTagSeeder::class,
            BlogProductSeeder::class,
        ]);
    }
}
