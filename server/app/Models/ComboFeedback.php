<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComboFeedback extends Model
{
    use HasFactory;

    protected $table = 'combo_feedbacks';
    protected $guarded;

    /**
     * Người dùng đã đánh giá combo này.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Combo được đánh giá.
     */
    public function combo()
    {
        return $this->belongsTo(Combo::class);
    }

    /**
     * Đơn hàng liên quan đến feedback.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
