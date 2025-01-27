<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Lấy thông tin toàn bộ Users
    | Path: api/users
    |--------------------------------------------------------------------------
    */
    public function index()
    {
        try {
            // Eager load các mối quan hệ liên quan
            $users = User::with('addresses', 'carts.sku.product', 'carts.sku.variantValues', 'favorites.product', 'vouchers.productVoucher', 'wallet', 'productFeedbacks.product', 'orders.items.product', 'orders.items.sku', 'orders.items.sku.variantValues')
                ->get();

            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy thông tin User theo id
    | Path: /api/users/{{userId}}
    |--------------------------------------------------------------------------
    */
    public function show($userId)
    {
        try {
            // Eager load các mối quan hệ liên quan
            $users = User::with('addresses', 'carts.sku.product', 'carts.sku.variantValues', 'favorites.product', 'vouchers.productVoucher', 'wallet', 'productFeedbacks.product', 'orders.items.product', 'orders.items.sku', 'orders.items.sku.variantValues')
                ->find($userId);

            // Không tìm thấy User
            if (!$users) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found',
                    'data' => NULL
                ], 404);
            }

            // Tìm thấy User
            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách đơn hàng User
    | Path: /api/users/{{userId}}/orders
    |--------------------------------------------------------------------------
    */
    public function orders($userId)
    {
        try {
            // Lấy user kèm theo danh sách orders
            $user = User::with('orders.items.product', 'orders.items.sku', 'orders.items.sku.variantValues')->find($userId);

            // Không tìm thấy User
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found',
                    'data' => NULL
                ], 404);
            }

            // Trả về danh sách orders
            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách mã giảm giá User
    | Path: /api/users/{{userId}}/vouchers
    |--------------------------------------------------------------------------
    */
    public function vouchers($userId)
    {
        try {
            // Lấy user kèm theo danh sách vouchers
            $user = User::with('vouchers.productVoucher')->find($userId);

            // Không tìm thấy User
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found',
                    'data' => null
                ], 404);
            }

            // Trả về danh sách vouchers của user
            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách giỏ hàng User
    | Path: /api/users/carts/{{userId}}
    |--------------------------------------------------------------------------
    */
    public function carts($userId)
    {
        try {
            // Lấy user kèm theo danh sách orders
            $user = User::with('carts.sku.product', 'carts.sku.variantValues')->find($userId);

            // Không tìm thấy User
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found',
                    'data' => NULL
                ], 404);
            }

            // Trả về danh sách orders
            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách yêu thích sản phẩm User
    | Path: /api/users/{{userId}}/favorites
    |--------------------------------------------------------------------------
    */
    public function favorites($userId)
    {
        try {
            // Lấy user kèm theo danh sách orders
            $user = User::with('favorites.product')->find($userId);

            // Không tìm thấy User
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found',
                    'data' => NULL
                ], 404);
            }

            // Trả về danh sách orders
            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách đánh giả sản phẩm User
    | Path: /api/users/{{userId}}/product-feedbacks
    |--------------------------------------------------------------------------
    */
    public function productFeedbacks($userId)
    {
        try {
            // Lấy user kèm theo danh sách orders
            $user = User::with('productFeedbacks.product')->find($userId);

            // Không tìm thấy User
            if (!$user) {
                return response()->json([
                    'status' => 404,
                    'message' => 'User not found',
                    'data' => NULL
                ], 404);
            }

            // Trả về danh sách orders
            return response()->json([
                'status' => 200,
                'message' => 'Success',
                'data' => $user
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 500,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
