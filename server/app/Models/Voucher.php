<?php

namespace App\Models;

use App\Enums\Voucher\VoucherStatus;
use App\Enums\Voucher\VoucherType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'random_flag' => 'boolean',
        'voucher_status' => VoucherStatus::class,
        'voucher_type' => VoucherType::class,
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_vouchers');
    }

    public function productVoucher()
    {
        return $this->hasMany(ProductVoucher::class, 'voucher_id');
    }
}
