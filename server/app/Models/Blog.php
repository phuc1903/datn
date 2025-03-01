<?php

namespace App\Models;

use App\Enums\Blog\BlogStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'random_flag' => 'boolean',
        'blog_status' => BlogStatus::class,
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'blog_products');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'blog_tags');
    }

    // Thêm miền vào link image_url cho FE get
    public function getImageUrlAttribute($value)
    {
        return $value ? asset($value) : null;
    }
}
