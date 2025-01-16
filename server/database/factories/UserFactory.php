<?php

namespace Database\Factories;

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
            'first_name' => $this->faker->firstName(),  // Tạo tên đầu tiên ngẫu nhiên
            'last_name' => $this->faker->lastName(),  // Tạo họ tên ngẫu nhiên
            'phone_number' => $this->faker->phoneNumber(),  // Tạo số điện thoại ngẫu nhiên
            'email' => $this->faker->unique()->safeEmail(),  // Tạo email duy nhất
            'email_verified_at' => now(),  // Đặt thời gian xác minh email
            'password' => bcrypt('password'),  // Mã hóa mật khẩu
            'status' => $this->faker->randomElement(['active', 'banned']),  // Chọn trạng thái ngẫu nhiên
            'sex' => $this->faker->randomElement(['male', 'female', 'other']),  // Chọn giới tính ngẫu nhiên
            'remember_token' => $this->faker->uuid(),  // Tạo token nhớ
        ];
    }
}
