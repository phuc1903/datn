<?php

namespace App\Models;

use App\Enums\Slide\SlideStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'random_flag' => 'boolean',
        'slide_status' => SlideStatus::class,
    ];

}
