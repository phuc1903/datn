<?php

namespace App\Models;

use App\Enums\Combo\ComboHot;
use App\Enums\Combo\ComboStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Combo extends Model
{
    use HasFactory;

    protected $casts = [
        'random_flag' => 'boolean',
        'product_status' => ComboStatus::class,
        'product_hot' => ComboHot::class,
    ];

    protected $guarded = [];

    public function skus()
    {
        return $this->belongsToMany(Sku::class, 'combo_products');
    }

    public function images()
    {
        return $this->hasMany(ComboImage::class);
    }

    public function categories() 
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }
}
