<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_vouchers');
    }

    public function productVoucher()
    {
        return $this->hasMany(ProductVoucher::class, 'voucher_id');
    }
}
