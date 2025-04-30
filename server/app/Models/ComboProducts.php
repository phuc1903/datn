<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComboProducts extends Model
{
    use HasFactory;

    protected $table = "combo_products";

    protected $guarded = [];
}
