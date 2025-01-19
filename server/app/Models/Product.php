<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function skus()
    {
        return $this->hasMany(Sku::class);
    }

    // Quan hệ với ảnh sản phẩm
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    // Quan hệ với phản hồi sản phẩm
    public function feedbacks()
    {
        return $this->hasMany(ProductFeedback::class);
    }

    // Quan hệ với danh mục (Nhiều danh mục)
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }
}
