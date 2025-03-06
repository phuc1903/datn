<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Enums\Voucher\VoucherStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductFeedback;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
                'status' => 'success',
                'message' => 'Got all users',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 'error',
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
            $users = User::with('addresses',
                'carts.sku.product',
                'carts.sku.variantValues',
                'favorites',
                'vouchers.productVoucher',
                'wallet',
                'productFeedbacks.product',
                'orders.items.product',
                'orders.items.sku',
                'orders.items.sku.variantValues')
                ->find($userId);

            // Không tìm thấy User
            if (!$users) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not found',
                    'data' => NULL
                ], 404);
            }

            // Tìm thấy User
            return response()->json([
                'status' => 'success',
                'message' => 'Got user data',
                'data' => $users
            ], 200);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return response()->json([
                'status' => 'error',
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
    public function orders():JsonResponse
    {
        try {
            $user = auth()->user(); // Lấy người dùng đang đăng nhập
            $orders = $user->orders()
                ->orderBy('created_at', 'desc') // Sắp xếp theo thời gian tạo mới nhất
                ->get();
            if ($orders) {
                return ResponseSuccess('Order retrieved successfully.',$orders,200);
            } else {
                return ResponseError('Dont have any Order',null,404);
            }
        }
        catch (\Exception $e){
            return ResponseError($e->getMessage(),null,500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách mã giảm giá User
    | Path: /api/users/vouchers
    |--------------------------------------------------------------------------
    */
    public function vouchers()
    {
        try {
            // Lấy người dùng đang đăng nhập
            $user = Auth::user();

            // Lấy user kèm theo danh sách vouchers
            $vouchers = User::with(['vouchers' => function ($query) {
                $query->where('status', VoucherStatus::Active);
            }, 'vouchers.productVoucher'])
                ->find($user->id);

            // Trả về danh sách vouchers của user
            return ResponseSuccess('Got user vouchers', $vouchers);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), null, 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách giỏ hàng User
    | Path: /api/users/carts
    |--------------------------------------------------------------------------
    */
    public function carts()
    {
        try {
            $userId = Auth::id();

            // Lấy user kèm theo danh sách orders
            $user = User::with('carts.sku.product', 'carts.sku.variantValues')->find($userId);

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', null, 404);
            }

            // Trả về danh sách orders
            return ResponseSuccess('Got user carts', $user);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách yêu thích sản phẩm User
    | Path: /api/users/{{userId}}/favorites
    |--------------------------------------------------------------------------
    */
    public function favorites()
    {
        try {
            $userId = Auth::id();
            // Lấy user kèm theo danh sách orders
            $user = User::with('favorites.product')->find($userId);

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found',null,404);
            }

            // Trả về danh sách orders
            return ResponseSuccess('Got user favorites',$user);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(),null,500);
        }
    }
    /*
    |--------------------------------------------------------------------------
    | Lấy danh sách yêu thích sản phẩm User
    | Path: /api/users/{{userId}}/favorites
    |--------------------------------------------------------------------------
    */
    public function addToFavorites(Request $request)
    {
        try {
            $userId = Auth::id();

            if (!$userId) {
                return ResponseError('User not authenticated', null, 401);
            }

            $user = User::find($userId);
            if (!$user) {
                return ResponseError('User not found', null, 404);
            }

            $productId = $request->input('product_id');

            $product = Product::find($productId);
            if (!$product) {
                return ResponseError('Product not found', null, 404);
            }

            // Kiểm tra sản phẩm đã có trong danh sách yêu thích hay chưa
            $exists = $user->favorites()->where('product_id', $productId)->exists();

            if ($exists) {
                return ResponseError('Product already in favorites', null, 400);
            }

            // Nếu chưa có, thêm sản phẩm vào danh sách yêu thích
            $user->favorites()->attach($productId);

            return ResponseSuccess('Product added to favorites', $user->favorites()->get());
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

    public function removeFromFavorites(Request $request)
    {
        try {
            $userId = Auth::id();

            if (!$userId) {
                return ResponseError('User not authenticated', null, 401);
            }

            $user = User::find($userId);
            if (!$user) {
                return ResponseError('User not found', null, 404);
            }

            $productId = $request->input('product_id');

            // Kiểm tra sản phẩm có trong danh sách yêu thích không
            $exists = $user->favorites()->where('product_id', $productId)->exists();

            if (!$exists) {
                return ResponseError('Product not in favorites', null, 400);
            }

            // Xóa sản phẩm khỏi danh sách yêu thích
            $user->favorites()->detach($productId);

            return ResponseSuccess('Product removed from favorites', $user->favorites()->get());
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }

}
