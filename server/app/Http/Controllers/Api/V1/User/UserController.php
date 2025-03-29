<?php

namespace App\Http\Controllers\Api\V1\User;

use App\Enums\Voucher\VoucherStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Address\AddAddressRequest;
use App\Http\Requests\Api\V1\Address\PutAddressRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductFeedback;
use App\Models\User;
use App\Models\UserAddress;
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
            $users = User::with('addresses', 'carts.sku.product', 'carts.sku.variantValues', 'favorites.product', 'wallet', 'productFeedbacks.sku', 'orders.items.sku', 'orders.items.sku', 'orders.items.sku.variantValues')
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
            $orders = $user->orders()->with('items', 'items.sku', 'items.sku.product')
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
            }])
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
    | Path: /api/users/favorites
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

    /*
    |--------------------------------------------------------------------------
    | function address
    |--------------------------------------------------------------------------
    */
    public function getAddressUser()
    {
        try {
            $userId = Auth::id();
            // Không tìm thấy User
            if (!$userId) {
                return ResponseError('User not found',null,404);
            }

            $userAddresses = UserAddress::with(['province', 'district', 'ward'])
                ->where('user_id', $userId)
                ->select('id','name','phone_number', 'address', 'province_code', 'district_code', 'ward_code', 'default')
                ->orderByRaw("CASE WHEN `default` = 'default' THEN 1 ELSE 0 END DESC")
                ->get();

            // Trả về danh sách orders
            return ResponseSuccess('Got user address',$userAddresses);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(),null,500);
        }
    }
    public function addAddressUser(AddAddressRequest $request)
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

            // Nếu địa chỉ mới được đặt làm mặc định, cập nhật các địa chỉ khác thành 'non-default'
            if ($request->default === 'default') {
                UserAddress::where('user_id', $userId)->update(['default' => 'other']);
            }

            // Thêm địa chỉ mới vào bảng `user_address`
            $newAddress = UserAddress::create([
                'user_id' => $userId,
                'address' => $request->address,
                'province_code' => $request->province_code,
                'district_code' => $request->district_code,
                'ward_code' => $request->ward_code,
                'name' => $request->name,
                'phone_number' => $request->phone_number,
                'default' => $request->default ?? 'other', // Nếu không có, đặt mặc định là 'non-default'
            ]);

            // Lấy lại danh sách địa chỉ sau khi thêm mới
            $userAddresses = UserAddress::with(['province', 'district', 'ward'])
                ->where('user_id', $userId)
                ->orderByRaw("CASE WHEN `default` = 'default' THEN 1 ELSE 0 END DESC")
                ->get();

            return ResponseSuccess('Address added successfully', $userAddresses);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
    public function updateAddressUser(PutAddressRequest $request)
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

            $address = UserAddress::where('id', $request->address_id)
                ->where('user_id', Auth::id()) // Đảm bảo địa chỉ thuộc về user đang đăng nhập
                ->first();
            if (!$address) {
                return ResponseError('User dont have this address', null, 400);
            }

            // Nếu địa chỉ mới được đặt làm mặc định, cập nhật các địa chỉ khác thành 'other'
            if ($request->default === 'default') {
                UserAddress::where('user_id', $userId)->update(['default' => 'other']);
            }

            // Sửa địa chỉ bảng `user_address`
            $newAddress = UserAddress::find($address->id)->update([
                'address' => $request->address,
                'province_code' => $request->province_code,
                'district_code' => $request->district_code,
                'ward_code' => $request->ward_code,
                'name' => $request->name,
                'phone_number' => $request->phone_number,
                'default' => $request->default,
            ]);

            // Lấy lại danh sách địa chỉ sau khi thêm mới
            $userAddresses = UserAddress::with(['province', 'district', 'ward'])
                ->where('user_id', $userId)
                ->orderByRaw("CASE WHEN `default` = 'default' THEN 1 ELSE 0 END DESC")
                ->get();

            return ResponseSuccess('Address update successfully', $userAddresses);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
    public function deleteAddressUser(Request $request)
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

            $address = UserAddress::where('id', $request->address_id)
                ->where('user_id', Auth::id()) // Đảm bảo địa chỉ thuộc về user đang đăng nhập
                ->first();
            if (!$address) {
                return ResponseError('User dont have this address', null, 400);
            }

            UserAddress::find($address->id)->delete();

            // Lấy lại danh sách địa chỉ sau khi thêm mới
            $userAddresses = UserAddress::with(['province', 'district', 'ward'])
                ->where('user_id', $userId)
                ->orderByRaw("CASE WHEN `default` = 'default' THEN 1 ELSE 0 END DESC")
                ->get();

            return ResponseSuccess('Address delete successfully', $userAddresses);
        } catch (\Exception $e) {
            return ResponseError($e->getMessage(), null, 500);
        }
    }
}
