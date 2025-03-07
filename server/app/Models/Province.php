<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    use HasFactory;

    protected $table = 'provinces';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [];

    public function administrativeRegion()
    {
        return $this->belongsTo(administrativeRegions::class, 'administrative_region_id');
    }

    public function administrativeUnit()
    {
        return $this->belongsTo(AdministrativeUnits::class, 'administrative_unit_id');
    }

    public function districts()
    {
        return $this->hasMany(District::class, 'province_code', 'code');
    }
}
