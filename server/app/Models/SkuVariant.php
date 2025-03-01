<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SkuVariant extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function sku()
    {
        return $this->belongsTo(Sku::class);
    }

    // Liên kết với VariantValue
    public function variantValue()
    {
        return $this->belongsTo(VariantValue::class);
    }
    
}
