<?php

namespace App\Models;

use App\Enums\Admin\AdminSex;
use App\Enums\Admin\AdminStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class Admin extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;
    protected $fillable = [
        'first_name', 'last_name', 'phone_number', 'email', 'password', 'status', 'sex'
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'random_flag' => 'boolean',
        'admin_status' => AdminStatus::class,
        'admin_sex' => AdminSex::class,
    ];
}
