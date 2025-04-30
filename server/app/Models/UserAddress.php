<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function province()
    {
        return $this->belongsTo(Province::class, 'province_code', 'code')->select('code','name','name_en','full_name','full_name_en','code_name');
    }

    public function district()
    {
        return $this->belongsTo(District::class, 'district_code', 'code')->select('code','name','name_en','full_name','full_name_en','code_name');
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class, 'ward_code', 'code')->select('code','name','name_en','full_name','full_name_en','code_name');
    }
}
