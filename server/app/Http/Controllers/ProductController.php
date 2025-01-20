<?php

namespace App\Http\Controllers;

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
        $products = $this->product->with([
            'images',
            'categories',
            'skus.variantValues.variant' // Lấy SKU và giá trị biến thể
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
    public function getListProductsNotSku(): JsonResponse
    {
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
    public function getProduct($id): JsonResponse
    {
        $products = $this->product->with([
            'images',
            'categories',
            'skus.variantValues.variant' // Lấy SKU và giá trị biến thể
        ])->find($id);

        if ($products->isEmpty()) {
            return response()->json([
                'status' => '404',
                'data' => $products,
                'message' => 'Products retrieved unsuccessfully.'
            ], 404);
        } else {
            return response()->json([
                'status' => '200',
                'data' => $products,
                'message' => 'Product not found .'
            ], 200);
        }
    }
    public function getProductByCategory($category_id): JsonResponse
    {
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
}
