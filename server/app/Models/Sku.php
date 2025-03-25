<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sku extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    // Quan hệ với Variant Values (các giá trị biến thể)
    public function variantValues()
    {
        return $this->belongsToMany(VariantValue::class, 'sku_variants')->select('variant_values.id', 'variant_values.value', 'variant_values.variant_id');
    }

    public function skuVariants()
    {
        return $this->hasMany(SkuVariant::class, 'sku_id', 'id');
    }

    // Thêm miền vào link image_url cho FE get
    public function getImageUrlAttribute($value)
    {
        return $value ? asset($value) : null;
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
