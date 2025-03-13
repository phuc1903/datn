<?php

namespace App\Models;

use App\Enums\Combo\ComboHot;
use App\Enums\Combo\ComboStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Combo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $casts = [
        'random_flag' => 'boolean',
        'product_status' => ComboStatus::class,
        'product_hot' => ComboHot::class,
    ];

    protected $guarded = [];

    public function skus()
    {
        return $this->belongsToMany(Sku::class, 'combo_products')->select('sku_code','product_id','image_url');
    }
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_categories');
    }
}
