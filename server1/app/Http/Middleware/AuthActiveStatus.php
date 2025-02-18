<?php

namespace App\Http\Middleware;

use App\Enums\User\UserStatus;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthActiveStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra Route API hay Web
        $isApi = $request->expectsJson() || str_starts_with($request->path(), 'api/');

        // Kiểm tra đăng nhập
        if (!Auth::check()) {
            if ($isApi) {
                return ResponseError('Authentication failed. Please log in again', null, 401);
            }
            return redirect()->route('login');
        }

        $user = Auth::user();

        // Kiểm tra trạng thái hoạt động
        if ($user->status !== UserStatus::Active) {
            if ($isApi) {
                return ResponseError('User is not active', null, 401);
            }
            return redirect()->route('login');
        }

        return $next($request);
    }
}
