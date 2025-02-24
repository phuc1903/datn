<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserCart extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function sku()
    {
        return $this->beLongsTo(Sku::class, 'sku_id');
    }
}
