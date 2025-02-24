<?php

namespace App\Models;

use App\Enums\Admin\AdminSex;
use App\Enums\Admin\AdminStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    use HasFactory;
    protected $guarded = [];

    protected $casts = [
        'random_flag' => 'boolean',
        'admin_status' => AdminStatus::class,
        'admin_sex' => AdminSex::class,
    ];
}
