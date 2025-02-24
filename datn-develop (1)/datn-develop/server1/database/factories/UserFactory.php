<?php

namespace Database\Factories;

use App\Enums\User\UserSex;
use App\Enums\User\UserStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * Đặc điểm mô hình này.
     *
     * @var string
     */
    protected $model = User::class;

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
            'status' => $this->faker->randomElement(UserStatus::getValues()),
            'sex' => $this->faker->randomElement(UserSex::getValues()),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }


    /**
     * Đặt trạng thái banned.
     */
    public function banned()
    {
        return $this->state(function () {
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
        return $this->state(function () {
            return [
                'status' => 'active',
            ];
        });
    }
}
