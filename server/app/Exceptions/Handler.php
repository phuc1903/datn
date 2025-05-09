<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });

        // Xử lý ThrottleRequestsException (custom nội dung giới hạn request của middleware('throttle'))
        $this->renderable(function (ThrottleRequestsException $e, $request) {
            if ($request->expectsJson()) {
                return ResponseError(
                    'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau ít phút.',
                    ['retry_after' => $e->getHeaders()['Retry-After'] ?? 60],
                    429
                );
            }
        });
    }

    public function unauthenticated($request, AuthenticationException $exception)
    {
        // Nếu request là API, trả về JSON
        if ($request->expectsJson()) {
            return ResponseError('Authentication failed. Please log in again', null, 401);
        }

        // Nếu là web, chuyển hướng về trang login
        return redirect()->guest(route('login'));
    }
}
