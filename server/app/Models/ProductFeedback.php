<?php

namespace App\Models;

use App\Enums\Product\ProductFeedbackStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductFeedback extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $table = 'product_feedbacks';
    protected $casts = [
        'random_flag' => 'boolean',
        'product_feedback_status' => ProductFeedbackStatus::class,
    ];

    // Quan hệ giữa ProductFeedback và User
    public function user()
    {
        return $this->belongsTo(User::class)->where('status', 'active');
    }

    public function sku()
    {
        return $this->belongsTo(Sku::class, 'sku_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
