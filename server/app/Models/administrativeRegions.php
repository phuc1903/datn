<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class administrativeRegions extends Model
{
    use HasFactory;

    protected $table = "administrative_regions";

    protected $fillable  = [];

    public function provinces()
    {
        return $this->hasMany(Province::class, 'administrative_region_id');
    }
}
