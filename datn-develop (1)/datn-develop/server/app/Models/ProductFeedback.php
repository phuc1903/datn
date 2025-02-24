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

    public function product()
    {
        return $this->beLongsTo(Product::class, 'product_id');
    }
    // Quan hệ giữa ProductFeedback và User
    public function user()
    {
        return $this->belongsTo(User::class)->where('status', 'active');
    }

}
