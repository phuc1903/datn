<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductFeedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller
{
    private $product;
    public function __construct(Product $product)
    {
        $this->product = $product;
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy toàn bộ thông tin toàn bộ Products
    | Path: api/products
    |--------------------------------------------------------------------------
    */


    public function getAllProduct(): JsonResponse
    {
        try {
            $products = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant'
            ])
                ->withCount('feedbacks') // Đếm số lượt đánh giá
                ->withAvg('feedbacks', 'product_feedback.rating') // Lấy số sao trung bình
                ->select([
                    'products.*',
                    DB::raw("ROUND((SELECT AVG(product_feedbacks.rating) FROM product_feedbacks WHERE product_feedbacks.product_id = products.id), 1) as rating_avg")
                ])
                ->get();

            if ($products->isEmpty()) {
                return ResponseError('No products found', null, 404);
            }

            return ResponseSuccess('Products retrieved successfully.', $products);
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy thông tin toàn bộ Products không có SKU
    | Path:
    |--------------------------------------------------------------------------
    */
    public function getListProductsNotSku(): JsonResponse
    {
        try {
            $products = $this->product->with([
                'images',
                'categories'
            ])
                ->withCount('feedbacks') // Đếm số lượt đánh giá
                ->withAvg('feedbacks', 'product_feedback.rating') // Lấy số sao trung bình
                ->select([
                    'products.*',
                    DB::raw("ROUND((SELECT AVG(product_feedbacks.rating) FROM product_feedbacks WHERE product_feedbacks.product_id = products.id), 1) as rating_avg")
                ])
                ->get();
            if ($products) {
                return ResponseSuccess('Products retrieved successfully.',$products,200);
            } else {
                return ResponseError('Dont have any products',null,404);
            }

        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(),null,500);

        }

    }
    /*
    |--------------------------------------------------------------------------
    | Lấy thông tin 1 Product
    | Path: api/products/{id}
    |--------------------------------------------------------------------------
    */
    public function getProduct($id): JsonResponse
    {
        try {
            // Lấy sản phẩm kèm bình luận, người dùng và thông tin khác
            $product = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant'
            ])
                ->withAvg('feedbacks', 'product_feedbacks.rating')  // Lấy số sao trung bình
                ->find($id);

            // Kiểm tra nếu sản phẩm không tồn tại
            if (!$product) {
                return ResponseError('Product not found', null, 404);
            }

            // Làm tròn số sao trung bình nếu có
            $product->rating_avg = $product->feedbacks_avg_product_feedback_rating
                ? round($product->feedbacks_avg_product_feedback_rating, 1)
                : null;

            return ResponseSuccess('Product retrieved successfully.', $product, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
    public function getFeedBackProduct($id): JsonResponse
    {
        try {
            // Lấy các feedback của sản phẩm với điều kiện người dùng có trạng thái active
            $productFeedback = ProductFeedback::with([
                'user'  // Lấy thông tin người dùng của bình luận
            ])
                ->where('product_id', $id)  // Lọc theo ID sản phẩm
                ->whereHas('user', function($query) {
                    $query->where('status', 'active');  // Chỉ lấy feedback của người dùng có trạng thái active
                })
                ->get();

            // Kiểm tra nếu không có feedback nào thỏa mãn
            if ($productFeedback->isEmpty()) {
                return ResponseError('No active user feedbacks found for this product', null, 404);
            }

            // Trả về tất cả feedbacks của người dùng có trạng thái active
            return ResponseSuccess('Product feedbacks from active users retrieved successfully.', $productFeedback, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }





    /*
    |--------------------------------------------------------------------------
    | Lấy thông tin toàn bộ Products theo Category
    | Path: api/products/category/{id}
    |--------------------------------------------------------------------------
    */
    public function getProductByCategory($category_id): JsonResponse
    {
        try {
            $products = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant'
            ])->whereHas('categories', function ($query) use ($category_id) {
                $query->where('categories.id', $category_id);
            })->get();

            if ($products) {
                return ResponseSuccess('Products retrieved successfully.',$products,200);
            } else {
                return ResponseError('Dont have any products',null,404);
            }

        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(),null,500);

        }

    }
    /*
    |--------------------------------------------------------------------------
    | Lấy thông tin Products được yêu thích nhiều nhất
    | Path: api/products/category/{id}
    |--------------------------------------------------------------------------
    */

    public function getMostFavoritedProducts(): JsonResponse
    {

        try {
            $products = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant'
            ])
                ->withCount('favoritedBy') // Đếm số lượt yêu thích của mỗi sản phẩm
                ->having('favorited_by_count', '>', 0) // Chỉ lấy sản phẩm có lượt yêu thích > 0
                ->orderByDesc('favorited_by_count') // Sắp xếp theo số lượt yêu thích giảm dần
                ->limit(10) // Giới hạn 10 sản phẩm phổ biến nhất
                ->get();

            if ($products->isEmpty()) {
                return ResponseError('No favorite products found', null, 404);
            }

            return ResponseSuccess('Most favorited products retrieved successfully.', $products, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }


    }
}
