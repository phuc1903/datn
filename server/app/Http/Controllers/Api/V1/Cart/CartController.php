<?php

namespace App\Http\Controllers\Api\V1\Cart;

use App\Enums\Product\ProductStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Cart\CartController\AddCartRequest;
use App\Http\Requests\Api\V1\Cart\CartController\UpdateCartRequest;
use App\Models\Sku;
use App\Models\UserCart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Thêm giỏ hàng cho User
    | Path: /api/carts
    |--------------------------------------------------------------------------
    */
    public function addCart(AddCartRequest $request)
    {
        try {
            $sku = $request->sku_code
                ? Sku::where('sku_code', $request->sku_code)->first()
                : Sku::find($request->sku_id);

            // Kiểm tra tồn tại
            if (!$sku) {
                return ResponseError('Sku is not found', null, 404);
            }

            // Kiểm tra hoạt động
            if ($sku->product->status !== ProductStatus::Active) {
                return ResponseError('Product is not active', null, 404);
            }

            // Kiểm tra số lượng
            if ($request->quantity > $sku->quantity) {
                return ResponseError('Not enough stock available', null, 400);
            }


            $exitstingCart = UserCart::where('user_id', Auth::id())
                ->where('sku_id', $sku->id)
                ->first();
            // Cập nhật số lượng nếu tồn tại
            if ($exitstingCart) {
                // Kiểm tra số lượng
                $newQuantity = $exitstingCart->quantity + $request->quantity;
                if ($newQuantity > $sku->quantity) {
                    return ResponseError('Not enough stock available', null, 400);
                }

                $exitstingCart->update(['quantity' => $newQuantity]);
                return ResponseSuccess('Update cart successfully', $exitstingCart, 200);
            }

            // Thêm mới nếu chưa tồn tại
            $cart = UserCart::create([
                'user_id' => Auth::id(),
                'sku_id' => $sku->id,
                'quantity' => $request->quantity
            ]);

            return ResponseSuccess('Add cart successfully', $cart, 201);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Cập nhật mới số lượng giỏ hàng User
    | Path: /api/carts/{product_id}
    |--------------------------------------------------------------------------
    */
    public function updateCart(UpdateCartRequest $request, $productId)
    {
        try {
            $cart = UserCart::whereHas('sku', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
                ->where('user_id', Auth::id())
                ->first();

            // Kiểm tra tồn tại
            if (!$cart) {
                return ResponseError('Product is not found', null, 404);
            }

            // Kiểm tra số lượng
            if ($request->quantity > $cart->sku->quantity) {
                return ResponseError('Not enough stock available', null, 400);
            }

            // Cập nhật số lượng
            $cart->update(['quantity' => $request->quantity]);

            return ResponseSuccess('Update cart successfully', $cart, 200);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Xóa sản phẩm giỏ hàng User
    | Path: /api/carts/{product_id}
    |--------------------------------------------------------------------------
    */
    public function deleteCart($productId)
    {
        try {
            // $cart = UserCart::all();
            $cart = UserCart::whereHas('sku', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
                ->where('user_id', Auth::id())
                ->delete();

            // Kiểm tra tồn tại
            if (!$cart) {
                return ResponseError('Product is not found', null, 404);
            }

            return ResponseSuccess('Delete cart successfully');
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Xóa giỏ hàng User
    | Path: /api/carts
    |--------------------------------------------------------------------------
    */
    public function deleteAllCart()
    {
        try {
            $cart = UserCart::where('user_id', Auth::id())
                ->delete();

            return ResponseSuccess('Delete all cart successfully');
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
