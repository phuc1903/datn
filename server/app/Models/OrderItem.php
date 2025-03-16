<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;
    protected $guarded = [];
  
    public function sku()
    {
        return $this->beLongsTo(Sku::class, 'sku_id');
    }

    public function combo()
    {
        return $this->beLongsTo(Combo::class, 'combo_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
