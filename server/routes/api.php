<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticatorController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\User\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
/*
|--------------------------------------------------------------------------
| ProductController
|--------------------------------------------------------------------------
*/
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'getProduct']);
    Route::get('/category/{id}', [ProductController::class, 'getProductByCategory']);
});

/*
|--------------------------------------------------------------------------
| CategoryController
|--------------------------------------------------------------------------
*/
Route::prefix('categories')->group(function () {
    Route::get('/',[CategoryController::class,'index']);
});

/*
|--------------------------------------------------------------------------
| AuthController
|--------------------------------------------------------------------------
|
| middleware(throttle:15,1) : Giới hạn 15 request trong 1 phút. Nếu vượt
| giới hạn thì sẽ trả ra lỗi 429. Kiểm tra nội dung được custom trong
| Exceptions/Handled.php => ThrottleRequestsException
|
*/
Route::middleware(['throttle:15,1'])->prefix('auth')->controller(AuthenticatorController::class)->group(function () {
    // Unauthenticated 
    Route::post('/login', 'login');
    Route::post('/register', 'register');
    Route::post('/forgot-password', 'forgotPassword');
    Route::post('/reset-password', 'resetPassword');

    // Authenticated 
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', 'logout');
        Route::post('/change-password', 'changePassword');
    });
});

/*
|--------------------------------------------------------------------------
| UserController
|--------------------------------------------------------------------------
*/
Route::prefix('users')->controller(UserController::class)->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::get('/{id}/orders', 'orders');
    Route::get('/{id}/vouchers', 'vouchers');
    Route::get('/{id}/carts', 'carts');
    Route::get('/{id}/favorites', 'favorites');
    Route::get('/{id}/product-feedbacks', 'productFeedbacks');
});
