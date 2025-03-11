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
                ->withCount('feedbacks') // Đếm số lượt đánh giá dựa trên SKU
                ->withAvg('feedbacks', 'rating') // Lấy số sao trung bình từ feedbacks
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
            $products = Product::with([
                'images',
                'categories'
            ])
                ->whereDoesntHave('skus') // Lọc ra sản phẩm không có SKU
                ->get();

            if ($products->isEmpty()) {
                return ResponseError('No products without SKU found.', null, 404);
            }

            return ResponseSuccess('Products without SKU retrieved successfully.', $products, 200);
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
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
            $product = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant'
            ])
                ->withCount('feedbacks') // Đếm số feedback qua SKU
                ->find($id);

            if (!$product) {
                return ResponseError('Product not found', null, 404);
            }

            // Lấy trung bình số sao từ feedbacks của SKU
            $averageRating = $product->feedbacks()->avg('rating');

            $product->rating_avg = $averageRating ? round($averageRating, 1) : null;

            return ResponseSuccess('Product retrieved successfully.', $product, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }



    public function getFeedBackProduct($id): JsonResponse
    {
        try {
            // Lấy feedback của sản phẩm dựa trên SKU
            $productFeedback = ProductFeedback::with([
                'user'  // Lấy thông tin người dùng của bình luận
            ])
                ->where('sku_id', $id)  // Lọc theo SKU ID
                ->whereHas('user', function ($query) {
                    $query->where('status', 'active');  // Chỉ lấy feedback của người dùng có trạng thái active
                })
                ->get();

            if ($productFeedback->isEmpty()) {
                return ResponseError('No active user feedbacks found for this SKU', null, 404);
            }

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
                ->withCount('favorites') // Đếm số lượt yêu thích của mỗi sản phẩm
                ->having('favorites_count', '>', 0) // Chỉ lấy sản phẩm có lượt yêu thích > 0
                ->orderByDesc('favorites_count') // Sắp xếp theo số lượt yêu thích giảm dần
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

    public function getSkus($id) {
        try {
            $product = Product::with('skus.variantValues')->find($id);
            return response()->json($product->skus);
        }catch(\Exception $e) {
            return response()->json($e->getMessage());
        }
    }
}
