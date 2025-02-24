<?php

namespace Database\Factories;

use App\Enums\Blog\BlogStatus;
use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blog>
 */
class BlogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Tên blog & slug
        $title = $this->faker->sentence(5);

        return [
            'admin_id' => Admin::inRandomOrder()->first()->id,
            'title' => $title,
            'short_description' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'image_url' => 'https://placehold.co/600x400',
            'status' => $this->faker->randomElement(BlogStatus::getValues()),
            'slug' => Str::slug($title),
            'created_at' => now(),
            'updated_at' => now()
        ];
    }

}
