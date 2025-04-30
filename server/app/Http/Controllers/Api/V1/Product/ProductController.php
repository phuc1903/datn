<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductFeedback;
use App\Models\Sku;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller
{

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
                'skus.variantValues.variant',
                'tags'
            ])->whereIn('status',['active','out_of_stock'])
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
                'categories',
                'tags'
            ])
                ->whereIn('status',['active','out_of_stock'])
                ->withCount('feedbacks') // Đếm số lượt đánh giá dựa trên SKU
                ->withAvg('feedbacks', 'rating') // Lấy số sao trung bình từ feedbacks
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
                'skus.variantValues.variant',
                'tags',
                'comments'
            ])
                ->withCount('feedbacks') // Đếm số feedback qua SKU
                ->find($id);

            if ($product->status == 'archived') {
                return ResponseError('Product archived', null, 400);
            }
            if (!$product) {
                return ResponseError('Product not found', null, 404);
            }

            // Lấy trung bình số sao từ feedbacks của SKU
            $averageRating = $product->feedbacks()->avg('rating');

            $product->rating_avg = $averageRating ? round($averageRating, 1) : null;
            // Lấy trung bình số sao từ feedbacks của SKU
            $averageRating = $product->feedbacks()->avg('rating');

            $product->rating_avg = $averageRating ? round($averageRating, 1) : null;

            return ResponseSuccess('Product retrieved successfully.', $product, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function getFeedBackProduct($productId): JsonResponse
    {
        try {
            // Lấy tất cả sku_id của sản phẩm
            $skuIds = Sku::where('product_id', $productId)->pluck('id');

            if ($skuIds->isEmpty()) {
                return ResponseError('Sản phẩm không có biến thể nào.', null, 404);
            }

            // Lấy feedback của tất cả các biến thể (sku)
            $productFeedbacks = ProductFeedback::with([
                'user',
                'sku.variantValues.variant',
            ])
                ->whereIn('sku_id', $skuIds)
                ->whereHas('user', function ($query) {
                    $query->where('status', 'active');
                })
                ->orderByDesc('created_at')
                ->get(); // Hoặc ->paginate(10)

            if ($productFeedbacks->isEmpty()) {
                return ResponseError('Không có đánh giá nào từ người dùng active cho sản phẩm này.', null, 404);
            }

            return ResponseSuccess('Lấy đánh giá sản phẩm thành công.', $productFeedbacks, 200);
        } catch (\Exception $e) {
            \Log::error('Lỗi khi lấy feedback sản phẩm: ' . $e->getMessage(), [
                'product_id' => $productId,
                'trace' => $e->getTraceAsString(),
            ]);
            return ResponseError('Đã có lỗi xảy ra khi lấy đánh giá sản phẩm.', null, 500);
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
                'skus.variantValues.variant',
                'tags'
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
    /*
        |--------------------------------------------------------------------------
        | Lấy thông tin Products theo tag sản phẩm
        |--------------------------------------------------------------------------
    */
    public function getProductByTag($tag_id): JsonResponse
    {
        try {
            $products = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant',
                'tags'
            ])->whereHas('tags', function ($query) use ($tag_id) {
                $query->where('tags.id', $tag_id);
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
        | Lấy thông tin Products liên quan dựa trên categories
        |--------------------------------------------------------------------------
    */
    public function getProductRelated($id): JsonResponse
    {
        try {
            // Tìm sản phẩm gốc
            $product = Product::with('categories')->find($id);
            if ($product->categories->isEmpty()) {
                return ResponseError('Product not has related products', null, 404);
            }
            if (!$product) {
                return ResponseError('Product not found', null, 404);
            }

            // Lấy danh sách category_id của sản phẩm đó
            $categoryIds = $product->categories->pluck('id');

            // Truy vấn các sản phẩm liên quan (cùng category nhưng không phải chính nó)
            $relatedProducts = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant',
                'tags'
            ])
                ->whereHas('categories', function ($query) use ($categoryIds) {
                    $query->whereIn('categories.id', $categoryIds);
                })
                ->where('id', '!=', $id) // Loại bỏ sản phẩm hiện tại
                ->limit(7)
                ->get();

            return ResponseSuccess('Related products retrieved successfully.', $relatedProducts, 200);
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    /*
       |--------------------------------------------------------------------------
       | Lấy thông tin Products liên có thể bạn sẽ thích
       |--------------------------------------------------------------------------
   */
    public function getProductAlsoLike(): JsonResponse
    {
        try {
            $user = Auth::user();

            // Kiểm tra nếu user chưa đăng nhập
            if (!$user) {
                return ResponseError('User not authenticated', null, 401);
            }

            // Lấy tối đa 5 sản phẩm mà user đã thích
            $likedProducts = $user->favorites()->with('tags')->limit(5)->get();

            // Lấy danh sách tag_id từ các sản phẩm đã thích
            $tagIds = $likedProducts->pluck('tags')->flatten()->pluck('id')->unique();

            // Nếu không có tag hoặc không tìm được sản phẩm liên quan, lấy sản phẩm active ngẫu nhiên
            $relatedProducts = Product::with([
                'images',
                'categories',
                'skus.variantValues.variant',
                'tags'
            ])
                ->whereHas('tags', function ($query) use ($tagIds) {
                    $query->whereIn('tags.id', $tagIds);
                })
                ->whereNotIn('id', $likedProducts->pluck('id')) // Không lấy sản phẩm đã thích
                ->where('status', 'active') // Chỉ lấy sản phẩm đang hoạt động
                ->withCount('feedbacks') // Đếm số lượt đánh giá
                ->withAvg('feedbacks', 'rating') // Lấy trung bình rating
                ->orderByDesc('feedbacks_avg_rating') // Ưu tiên rating cao
                ->orderByDesc('feedbacks_count') // Nếu rating bằng nhau, ưu tiên nhiều đánh giá hơn
                ->limit(2) // Giới hạn tối đa 2 sản phẩm liên quan
                ->get();

            // Nếu không tìm thấy sản phẩm liên quan, lấy sản phẩm active ngẫu nhiên
            if ($relatedProducts->isEmpty()) {
                $relatedProducts = Product::with([
                    'images',
                    'categories',
                    'skus.variantValues.variant',
                    'tags'
                ])
                    ->where('status', 'active') // Chỉ lấy sản phẩm đang hoạt động
                    ->withCount('feedbacks') // Đếm số lượt đánh giá
                    ->withAvg('feedbacks', 'rating') // Lấy trung bình rating
                    ->orderByDesc('feedbacks_avg_rating') // Ưu tiên rating cao
                    ->orderByDesc('feedbacks_count') // Nếu rating bằng nhau, ưu tiên nhiều đánh giá hơn
                    ->limit(2) // Giới hạn 2 sản phẩm
                    ->get();
            }

            return ResponseSuccess('Related high-rated active products retrieved successfully.', $relatedProducts, 200);
        }
        catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }




}
