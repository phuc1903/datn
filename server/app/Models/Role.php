<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    protected $table = 'roles';

    protected $guarded = [];

    public function admins()
    {
        return $this->belongsToMany(Admin::class, 'model_has_roles', 'role_id', 'model_id');
    }
}
