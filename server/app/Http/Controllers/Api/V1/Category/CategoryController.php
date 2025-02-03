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
    public function index(){
        try {
            // Lấy tất cả các danh mục cùng với danh mục con của chúng
            $categories = $this->category->select('id', 'name', 'short_description', 'parent_id', 'slug')->get();
            return response()->json([
                'status' => 'success',
                'data' => $categories
            ]);
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ],500);
        }

    }
//    public function recursiveCategory(){
//        // Lấy tất cả các danh mục cùng với danh mục con của chúng
//        $categories = $this->category->select('id', 'name', 'short_description', 'parent_id', 'slug')
//            ->where('parent_id',0)
//            ->with(['children' => function ($query) {
//                $query->where('status', '!=', 'hidden')
//                    ->select('id', 'name', 'short_description', 'parent_id', 'slug'); // Lọc các trường của danh mục con
//            }])
//            ->where('status', '!=', 'hidden') // Lọc danh mục chính có trạng thái khác "hidden"
//            ->get();
//
//        return response()->json([
//            'status' => 'success',
//            'data' => $categories
//        ]);
//    }
}
