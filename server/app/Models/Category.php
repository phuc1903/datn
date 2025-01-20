<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
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

    // Hàm đệ quy để lấy tất cả các danh mục con
    public function getAllChildren()
    {
        // Lấy tất cả các danh mục con (nếu có)
        $children = $this->children()->with('children')->get();

        foreach ($children as $child) {
            $child->children = $child->getAllChildren(); // Đệ quy lấy các danh mục con của mỗi danh mục con
        }

        return $children;
    }
}

