<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;
    protected $guarded = [];

    // Thêm miền vào link image_url cho FE get
    public function getImageUrlAttribute($value)
    {
        return $value ? asset($value) : null;
    }
}
