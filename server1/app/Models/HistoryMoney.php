<?php

namespace App\Models;

use App\Enums\Wallet\HistoryMoneysType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoryMoney extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $table = 'history_moneys';

    protected $casts = [
        'random_flag' => 'boolean',
        'history_moneys_type' => HistoryMoneysType::class,
    ];
}
