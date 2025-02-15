<?php

namespace Database\Factories;

use App\Enums\Admin\AdminSex;
use App\Enums\Admin\AdminStatus;
use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

class AdminFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = Admin::class;

    /**
     * Định nghĩa mẫu dữ liệu cho factory.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'phone_number' => $this->faker->phoneNumber(),
            'email' => $this->faker->unique()->lastName . '@gmail.com',
            'password' => bcrypt('password'),
            'status' => $this->faker->randomElement(AdminStatus::getValues()),
            'sex' => $this->faker->randomElement(AdminSex::getValues()),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    /**
     * Đặt trạng thái banned.
     */
    public function banned()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'banned',
            ];
        });
    }

    /**
     * Đặt trạng thái active.
     */
    public function active()
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'active',
            ];
        });
    }
}
