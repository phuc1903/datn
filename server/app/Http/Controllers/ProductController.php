<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
{
    /**
     * Lấy tất cả sản phẩm và biến thể
     */
    public function getProductsWithVariants(): JsonResponse
    {
        $products = Product::with([
            'skus.variantValues.variant' // Lấy SKU và giá trị biến thể
        ])->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}

