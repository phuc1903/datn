<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthenticatorController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Đăng nhập
    | Path: /api/auth/login
    |--------------------------------------------------------------------------
    */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255',
                'password' => 'required|max:255',
            ]);

            // Kiểm tra đầu vào
            if ($validator->fails()) {
                return ResponseError('Validation error', $validator->errors(), 400);
            }

            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Mật khẩu không hợp lệ
            if (!Hash::check($request->password, $user->password)) {
                return ResponseError('Invalid credentials', NULL, 401);
            }

            // Tạo token
            $token = $user->createToken($request->email)->plainTextToken;

            // Phản hồi kết quả
            $success = [
                'user' => $user,
                'token' => $token
            ];
            return ResponseSuccess('Login successfully', $success);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), NULL, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Đăng ký
    | Path: /api/auth/register
    |--------------------------------------------------------------------------
    */
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255',
                'password' => 'required|max:255',
                'first_name' => 'required|max:255',
                'last_name' => 'required|max:255',
                'phone_number' => 'required|max:255',
            ]);

            // Kiểm tra đầu vào
            if ($validator->fails()) {
                return ResponseError('Validation error', $validator->errors(), 400);
            }

            $user = User::where('email', $request->email)->first();

            // User đã tồn tại
            if ($user) {
                return ResponseError('User is found', NULL, 403);
            }

            // Tào tài khoản
            $user = User::create([
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'phone_number' => $request->phone_number
            ]);

            // Tạo token
            $token = $user->createToken($request->email)->plainTextToken;

            // Phản hồi kết quả
            $success = [
                'user' => $user,
                'token' => $token
            ];
            return ResponseSuccess('Register successfully', $success);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), NULL, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Đăng xuất
    | Path: /api/auth/logout
    |--------------------------------------------------------------------------
    */
    public function logout(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255'
            ]);

            // Kiểm tra đầu vào
            if ($validator->fails()) {
                return ResponseError('Validation error', $validator->errors(), 400);
            }

            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Xóa token
            $user->tokens()->where('tokenable_id', $user->id)->delete();

            // Phản hồi kết quả

            return ResponseSuccess('Logout successfully');
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), NULL, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Đổi mật khẩu
    | Path: /api/auth/change-password
    |--------------------------------------------------------------------------
    */
    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255',
                'current_password' => 'required|max:255',
                'new_password' => 'required|max:255|confirmed',
                'new_password_confirmation' => 'required|max:255',
            ]);

            // Kiểm tra đầu vào
            if ($validator->fails()) {
                return ResponseError('Validation error', $validator->errors(), 400);
            }

            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Kiểm tra mật khẩu 
            if (!Hash::check($request->current_password, $user->password)) {
                $errors = ['current_password' => 'Current password is incorrect'];
                return ResponseError('Invalid credentials', $errors, 401);
            }

            // Đổi mật khẩu
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Xóa toàn bộ token cũ
            $user->tokens->each(function ($token) {
                $token->delete();
            });

            // Tạo token mới
            $token = $user->createToken($request->email)->plainTextToken;

            // Phản hồi kết quả
            $success = ['token' => $token];
            return ResponseSuccess('Change password successfully', $success);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), NULL, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Quên mật khẩu
    | Path: /api/auth/forgot-password
    |--------------------------------------------------------------------------
    */
    public function forgotPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255',
                'debug' => 'nullable',
            ]);

            // Kiểm tra đầu vào
            if ($validator->fails()) {
                return ResponseError('Validation error', $validator->errors(), 400);
            }

            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Token bảo mật (remember_token) 
            $token = hash('sha256', Str::random(60));
            $user->remember_token = $token;
            $user->save();

            // Gữi mail reset password
            // ...

            // Debug
            if (isset($request->debug) && ($request->debug === true)) {
                $data['data'] = [
                    'token' => $token
                ];
            }

            // Phản hồi kết quả
            $success = [
                'status' => 'success',
                'message' => 'Please check Email to reset password',
                'data' => null
            ];

            if ($request->boolean('debug')) {
                $success['data'] = ['token' => $token];
            }

            return ResponseSuccess('Please check Email to reset password', $success);
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), NULL, 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Reset mật khẩu (cần chạy 'forgotPassword' để lấy token)
    | Path: /api/auth/forgot-password
    |--------------------------------------------------------------------------
    */
    public function resetPassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255',
                'token' => 'required',
                'password' => 'required|max:255',
            ]);

            // Kiểm tra đầu vào
            if ($validator->fails()) {
                return ResponseError('Validation error', $validator->errors(), 400);
            }

            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Kiểm tra Token bảo mật (remember_token) 
            if (($user->remember_token === NULL) || !hash_equals($user->remember_token, $request->token)) {
                return ResponseError('Token is not found', NULL, 404);
            }

            // Đổi mật khẩu
            $user->password = Hash::make($request->password);
            $user->remember_token = NULL; // Reset token
            $user->save();

            // Phản hồi kết quả
            return ResponseSuccess('Reset password successfully');
        } catch (\Exception $e) {
            // Bắt lỗi nếu có ngoại lệ
            return ResponseError($e->getMessage(), NULL, 500);
        }
    }
}
