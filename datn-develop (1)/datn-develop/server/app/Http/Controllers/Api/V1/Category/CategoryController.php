<?php

namespace App\Http\Controllers\Api\V1\Category;

use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller
{
    private $category;
    public function __construct(Category $category)
    {
        $this->category = $category;
    }
    /*
    |--------------------------------------------------------------------------
    | Lấy thông tin toàn bộ Category (chưa đệ quy)
    | Path: api/categories
    |--------------------------------------------------------------------------
    */
    public function index(){
        try {
            // Lấy tất cả các danh mục cùng với danh mục con của chúng
            $categories = $this->category->select('id', 'name', 'short_description', 'parent_id', 'slug')->get();
            if ($categories) {
                return ResponseSuccess('Get Categories successfully',$categories,200);
            } else {
                return ResponseError('Categories not found',null,404);
            }
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(),null,500);
        }

    }
}
