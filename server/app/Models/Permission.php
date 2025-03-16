<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as SpatiePermission;


class Permission extends SpatiePermission
{
    use HasFactory;

    protected $table = 'permissions';

    protected $guarded = [];
	
	protected $casts = [];
	
	
    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function getModuleName()
    {
        if ($this->module) {
			return '<a target="_blank" href="module/sua/'.$this->module->id.'">'.$this->module->name.'</a>';
		} else {
			return '<span class="badge text-bg-danger text-white">Không có Module</span>';
		}
    }
}
