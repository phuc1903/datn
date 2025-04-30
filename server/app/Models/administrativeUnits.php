<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class administrativeUnits extends Model
{
    use HasFactory;

    protected $table = "administrative_units";

    protected $fillable = [];

    public function provinces()
    {
        return $this->hasMany(Province::class, 'administrative_unit_id');
    }

    public function districts()
    {
        return $this->hasMany(District::class, 'administrative_unit_id');
    }

    public function wards()
    {
        return $this->hasMany(Ward::class, 'administrative_unit_id');
    }
}
