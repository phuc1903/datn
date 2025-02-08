<?php

namespace App\Models;

use App\Enums\Order\OrderPaymentMethod;
use App\Enums\Order\OrderStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'random_flag' => 'boolean',
        'order_status' => OrderStatus::class,
        'order_payment_method' => OrderPaymentMethod::class,
    ];

    public function user()
    {
        return $this->beLongsTo(User::class, 'user_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
}
