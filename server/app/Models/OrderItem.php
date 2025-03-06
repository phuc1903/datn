<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function product()
    {
        return $this->beLongsTo(Product::class, 'product_id');
    }
    public function sku()
    {
        return $this->beLongsTo(Sku::class, 'sku_id');
    }
    public function order()
    {
        return $this->belongsTo(\App\Models\Order::class, 'order_id');
    }
}
