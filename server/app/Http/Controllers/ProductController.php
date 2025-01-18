<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Lấy tất cả sản phẩm và biến thể
     */
    public function getAllProductsWithVariants(): JsonResponse
    {
        $products = Product::with([
            'images',
            'categories',
            'skus.variantValues.variant' // Lấy SKU và giá trị biến thể
        ])->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
    public function getProductsWithVariants($id): JsonResponse
    {
        $products = Product::with([
            'images',
            'categories',
            'skus.variantValues.variant' // Lấy SKU và giá trị biến thể
        ])->find($id);

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}

