<?php

namespace Database\Factories;

use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
use App\Models\Combo;
use App\Models\District;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Province;
use App\Models\Sku;
use App\Models\User;
use App\Models\Voucher;
use App\Models\Ward;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $status = $this->faker->randomElement(OrderStatus::getValues());

        $province = Province::inRandomOrder()->first();
        $district = District::where('province_code', $province->code)->inRandomOrder()->first();
        $ward = Ward::where('district_code', $district->code)->inRandomOrder()->first();

        return [
            'user_id' => User::inRandomOrder()->first()->id,
            'voucher_id' => Voucher::inRandomOrder()->first()->id,

            'full_name' => $this->faker->userName(),
            'email' => $this->faker->unique()->userName . '@gmail.com',
            'phone_number' => $this->faker->phoneNumber(),
            'address' => $this->faker->randomElement([0, 100])."/132 hẻm 12 " .$ward->name . " ". $district->name . " " .$province->name,

            'payment_method' => $this->faker->randomElement(OrderPaymentMethod::getValues()),
            'status' => $status,
            'shipping_cost' => $this->faker->randomElement([0, 10000]),
            'total_amount' => 0,

            'province_code' => $province->code,
            'district_code' => $district->code,
            'ward_code' => $ward->code,

            'note' => $this->faker->sentence(),
            'reason' => $status === 'cancel' ? $this->faker->sentence() : '',
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

    public function createOrderItems(int $count = 2)
    {
        return $this->afterCreating(function (Order $order) use ($count) {
            $orderDetails = OrderItem::factory()
                ->count($count)
                ->create([
                    'order_id' => $order->id,
                    'sku_id' => Sku::inRandomOrder()->first()->id,
                    'quantity' => 3,
                ]);

            $totalAmount = $orderDetails->sum(function ($orderItem) {
                return $orderItem->quantity * $orderItem->price;
            });

            $order->update([
                'total_amount' => $totalAmount + $order->shipping_cost
            ]);
        });
    }
}
