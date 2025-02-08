<?php

namespace App\Models;

use App\Enums\Product\ProductStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'random_flag' => 'boolean',
        'product_status' => ProductStatus::class
    ];

    public function skus()
    {
        return $this->hasMany(Sku::class)->select('id', 'sku_code', 'product_id', 'price', 'promotion_price', 'quantity', 'image_url');
    }

    // Quan hệ với ảnh sản phẩm
    public function images()
    {
        return $this->hasMany(ProductImage::class)->select('id', 'product_id', 'image_url');
    }

    // Quan hệ với phản hồi sản phẩm
    public function feedbacks()
    {
        return $this->hasMany(ProductFeedback::class);
    }

    // Quan hệ với danh mục (Nhiều danh mục)
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories')->select('categories.id', 'name', 'slug');
    }
}
