<?php

namespace App\Http\Controllers\Api\V1\Blog;

use App\Enums\Blog\BlogStatus;
use App\Enums\Product\ProductStatus;
use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách bài viết
    | Path: /api/v1/blogs
    | Params:
    |  - product_id (nếu có)
    |  - tag_id (nếu có)
    |--------------------------------------------------------------------------
    */
    public function getAllBlogs(Request $request)
    {
        try {
            $blogs = Blog::with('products', 'tags')
                ->where('status', BlogStatus::Published);

            // Lọc theo product_id (nếu có)
            $product_id = $request->product_id;
            if ($product_id) {
                $blogs = $blogs->whereHas('products', function ($query) use ($product_id) {
                    $query->where('product_id', $product_id);
                    $query->where('products.status', ProductStatus::Active);
                });
            }

            // Lọc theo tag bài viết (nếu có)
            $tag_id = $request->tag_id;
            if ($tag_id) {
                $blogs = $blogs->whereHas('tags', function ($query) use ($tag_id) {
                    $query->where('tag_id', $tag_id);
                });
            }

            $blogs = $blogs->get();

            return ResponseSuccess('Got all blogs', $blogs, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Lấy chi tiết bài viết
    | Path: /api/v1/blogs/{product_id}
    |--------------------------------------------------------------------------
    */
    public function getDetailBlog($blog_id)
    {
        try {
            $blog = Blog::with('products', 'tags')
                ->where('status', BlogStatus::Published)
                ->where('id', $blog_id)
                ->first();

            // Kiểm tra tồn tại
            if (!$blog) {
                return ResponseError('Blog is not found', null, 404);
            }

            return ResponseSuccess('Got blog details', $blog, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
