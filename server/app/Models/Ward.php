<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    use HasFactory;

    protected $table = 'wards';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [];

    public function district()
    {
        return $this->belongsTo(District::class, 'district_code', 'code');
    }

    public function administrativeUnit()
    {
        return $this->belongsTo(administrativeUnits::class, 'administrative_unit_id');
    }
}
