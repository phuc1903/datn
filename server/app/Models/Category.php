<?php

namespace App\Models;

use App\Enums\Category\CategoryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'random_flag' => 'boolean',
        'category_status' => CategoryStatus::class
    ];

    // Quan hệ một-nhiều (self-referencing)
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Quan hệ nhiều-một (self-referencing)
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function getAllChildren()
    {
        $children = $this->children()->with('children')->get();

        foreach ($children as $child) {
            $child->children = $child->getAllChildren(); 
        }

        return $children;
    }


    public function getParentCount()
    {
        $parentCount = 0;
        $parent = $this->parent; 

        while ($parent) {
            $parentCount++;
            $parent = $parent->parent;
        }

        return $parentCount; 
    }

    public function getImageUrlAttribute($value)
    {
        return $value ? asset($value) : null;
    }
}
