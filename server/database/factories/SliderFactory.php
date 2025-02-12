<?php

namespace Database\Factories;

use App\Enums\Slide\SlideStatus;
use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Slider>
 */
class SliderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'banner '.$this->faker->name(),
            'image_url'=>'https://placehold.co/600x400',
            'status' => $this->faker->randomElement(SlideStatus::getValues()),
            'priority'=>rand(1,4),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }
}
