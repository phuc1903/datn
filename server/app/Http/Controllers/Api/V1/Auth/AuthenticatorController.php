<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Enums\User\UserStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\Authenticator\ChangePasswordRequest;
use App\Http\Requests\Api\V1\Auth\Authenticator\ForgotPasswordRequest;
use App\Http\Requests\Api\V1\Auth\Authenticator\LoginRequest;
use App\Http\Requests\Api\V1\Auth\Authenticator\LogoutRequest;
use App\Http\Requests\Api\V1\Auth\Authenticator\RegisterRequest;
use App\Http\Requests\Api\V1\Auth\Authenticator\ResetPasswordRequest;
use App\Mail\ForgotPasswordMail;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;

class AuthenticatorController extends Controller
{
    public function loginGoogle()
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();
        return ResponseSuccess('Please redirect to url', ['url' => $url]);
    }

    public function handleGoogleCallback(Request $request)
    {
        try {
            // Handle the OAuth callback
            $code = $request->get('code');
            if (!$code) {
                throw new \Exception('Không nhận được mã xác thực từ Google');
            }
    
            // Get the user data from the token
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Find existing user by Google ID or email
            $user = User::where('google_id', $googleUser->id)
            ->orWhere('email', $googleUser->email)
            ->first();
            
            // If user doesn't exist, create a new one
            if (!$user) {
                $user = User::create([
                    'google_id' => $googleUser->id,
                    'email' => $googleUser->email,
                    'first_name' => $googleUser->user['given_name'] ?? '',
                    'last_name' => $googleUser->user['family_name'] ?? '',
                    'phone_number' => 'N/A', 
                    'password' => bcrypt(uniqid()),
                    'status' => UserStatus::Active
                ]);
            } else {
                // Update the Google ID if the user registered with email but is now using Google login
                if (empty($user->google_id)) {
                    $user->google_id = $googleUser->id;
                    $user->save();
                }
            }
            
            // Generate token
            $token = $user->createToken($user->email)->plainTextToken;
            
            // Get the frontend redirect URL from config
            $redirectUrl = env('GOOGLE_REDIRECT_URL_TO_FRONTEND');
            
            // Add token and user info as query parameters
            $redirectUrl .= '?token=' . $token;
            $redirectUrl .= '&email=' . urlencode($user->email);
            $redirectUrl .= '&firstName=' . urlencode($user->first_name);
            $redirectUrl .= '&lastName=' . urlencode($user->last_name);
            $redirectUrl .= '&status=success';
            
            // Redirect to frontend with token and user info
            return redirect($redirectUrl);
        } catch (\Exception $e) {
            // Đơn giản hóa thông báo lỗi
            $errorMessage = 'Đăng nhập Google thất bại';
            
            // Nếu là lỗi cụ thể, cung cấp thông tin rõ ràng hơn
            if (stripos($e->getMessage(), 'invalid_grant') !== false) {
                $errorMessage = 'Phiên đăng nhập đã hết hạn, vui lòng thử lại';
            }
            
            // Redirect về frontend với thông báo lỗi đơn giản
            $redirectUrl = env('GOOGLE_REDIRECT_URL_TO_FRONTEND');
            $redirectUrl .= '?status=error';
            $redirectUrl .= '&Message=' . urlencode($errorMessage);
            
            return redirect($redirectUrl);
        }
    }
    

    /*
    |--------------------------------------------------------------------------
    | Đăng nhập
    | Path: /api/auth/login
    |--------------------------------------------------------------------------
    */
    public function login(LoginRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Trạng thái hoạt động
            if ($user->status !== UserStatus::Active) {
                return ResponseError('User is not active', NULL, 401);
            }

            // Tạo tài khoản bằng Google_id thì chỉ cho phép đăng nhập bằng Google
            if (!empty($user->google_id)) {
                return ResponseError('User registered by Google, please login with Google', NULL, 400);
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
    public function register(RegisterRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            // User đã tồn tại
            if ($user) {
                return ResponseError('User is found', NULL, 403);
            }

            // Tạo tài khoản
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
    public function logout(LogoutRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Xóa token
            $token = $user->tokens()->where('tokenable_id', $user->id)->delete();

            // Lỗi token
            if (!$token) {
                return ResponseError('Token not found', NULL, 404);
            }

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
    public function changePassword(ChangePasswordRequest $request)
    {
        try {
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
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            // Không tìm thấy User
            if (!$user) {
                return ResponseError('User not found', NULL, 404);
            }

            // Trạng thái hoạt động
            if ($user->status !== UserStatus::Active) {
                return ResponseError('User is not active', NULL, 401);
            }

            // Kiểm tra cấu hình mail
            if (hasCompleteMailConfig() != true) {
                return ResponseError('Cấu hình email không hợp lệ hoặc bị thiếu. Vui lòng kiểm tra lại cấu hình', null, 500);
            }

            // Token bảo mật (remember_token) 
            $token = hash('sha256', Str::random(60));
            $user->remember_token = $token;
            $user->save();
            $urlReset = config('app.frontend_url') . '/reset-password/' . $token; // CẤU HÌNH ĐƯỜNG DẪN RESET

            // Gữi email
            $email = $user->email;
            $requestTime = time();
            $userAgent = request()->header('User-Agent');
            $userIpAddress = request()->ip();
            Mail::to($user->email)->send(new ForgotPasswordMail(
                $email,
                $urlReset,
                $requestTime,
                $userAgent,
                $userIpAddress
            ));

            // Phản hồi kết quả
            if (isset($request->debug) && ($request->debug == true)) {
                return ResponseSuccess('Vui lòng kiểm tra email', ['token' => $token]);
            }

            return ResponseSuccess('Vui lòng kiểm tra email');
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
    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
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
