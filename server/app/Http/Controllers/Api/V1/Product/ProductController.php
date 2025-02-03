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
                    'status' => '200',
                    'data' => $products,
                    'message' => 'Products retrieved unsuccessfully.'
                ], 200);
            } else {
                return response()->json([
                    'status' => '402',
                    'data' => $products,
                    'message' => 'Product not found .'
                ], 404);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => '500',
                'data' => $e->getMessage(),
            ],500);

        }

    }
    public function getListProductsNotSku(): JsonResponse
    {
        try {
            $products = $this->product->with([
                'images',
                'categories'
            ])->get();
            if ($products->isEmpty()) {
                return response()->json([
                    'status' => '500',
                    'data' => $products,
                    'message' => 'Products retrieved unsuccessfully.'
                ], 500);
            } else {
                return response()->json([
                    'status' => '200',
                    'data' => $products,
                    'message' => 'Products retrieved successfully.'
                ], 200);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => '500',
                'data' => $e->getMessage(),
            ],500);
        }

    }
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
                    'status' => '200',
                    'data' => $products,
                    'message' => 'Products retrieved unsuccessfully.'
                ], 200);
            } else {
                return response()->json([
                    'status' => '402',
                    'data' => $products,
                    'message' => 'Product not found .'
                ], 404);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => '500',
                'data' => $e->getMessage()
            ],500);
        }

    }
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
                    'status' => '404',
                    'data' => $products,
                    'message' => 'Products not found.'
                ], 404);
            } else {
                return response()->json([
                    'status' => '200',
                    'data' => $products,
                    'message' => 'Products retrieved successfully.'
                ], 200);
            }
        }
        catch (\Exception $e) {
            return response()->json([
                'status' => '500',
                'data' => $e->getMessage(),
            ],500);
        }

    }
}
