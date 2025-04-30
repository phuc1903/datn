<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ComboComment extends Model
{


    protected $table = 'combo_comments';
    protected $guarded;

    // Người dùng đã viết comment
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Admin xử lý hoặc trả lời comment (nếu có logic admin)
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    // Comment cha (nếu là reply)
    public function parent()
    {
        return $this->belongsTo(self::class, 'parents_id');
    }

    // Các phản hồi con
    public function replies()
    {
        return $this->hasMany(self::class, 'parents_id');
    }
}
