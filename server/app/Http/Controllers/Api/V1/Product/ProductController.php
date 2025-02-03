<?php

namespace App\Http\Controllers\Api\V1\Product;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

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
    public function index(): JsonResponse
    {
        try {
            $products = $this->product->with([
                'images',
                'categories',
                'skus.variantValues.variant' // Lấy SKU và giá trị biến thể
            ])->get();

            if ($products) {
                return response()->json([
                    'status' => 'success',
                    'data' => $products,
                    'message' => 'Products retrieved unsuccessfully.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'data' => $products,
                    'message' => 'Dont have any products'
                ], 404);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => $e->getMessage(),
            ],500);

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
            ])->get();
            if ($products->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'data' => $products,
                    'message' => 'Products retrieved unsuccessfully.'
                ], 500);
            } else {
                return response()->json([
                    'status' => 'success',
                    'data' => $products,
                    'message' => 'Products retrieved successfully.'
                ], 200);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => $e->getMessage(),
            ],500);
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
            $products = $this->product->with([
                'images',
                'categories',
                'skus.variantValues.variant' // Lấy SKU và giá trị biến thể
            ])->find($id);

            if ($products) {
                return response()->json([
                    'status' => 'success',
                    'data' => $products,
                    'message' => 'Products retrieved unsuccessfully.'
                ], 200);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found .'
                ], 404);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => $e->getMessage()
            ],500);
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
            $products = $this->product->with([
                'images',
                'categories',
                'skus.variantValues.variant'
            ])->whereHas('categories', function ($query) use ($category_id) {
                $query->where('categories.id', $category_id);
            })->get();

            if ($products->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Products not found.'
                ], 404);
            } else {
                return response()->json([
                    'status' => 'success',
                    'data' => $products,
                    'message' => 'Products retrieved successfully.'
                ], 200);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'data' => $e->getMessage(),
            ],500);
        }

    }
}
