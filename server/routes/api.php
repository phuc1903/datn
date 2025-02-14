<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticatorController;
use App\Http\Controllers\Api\V1\Cart\CartController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\User\UserController;
use Illuminate\Support\Facades\Route;

// Version 1 
Route::prefix('v1')->group(function () {
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
        Route::get('/', [CategoryController::class, 'index']);
    });


    /*
    |--------------------------------------------------------------------------
    | AuthController
    |--------------------------------------------------------------------------
    */
    Route::prefix('auth')->controller(AuthenticatorController::class)->group(function () {
        // Unauthenticated 
        Route::post('/login', 'login');
        Route::post('/register', 'register');
        Route::post('/forgot-password', 'forgotPassword');
        Route::post('/reset-password', 'resetPassword');

        // Authenticated 
        Route::middleware(['auth:sanctum', 'auth.active'])->group(function () {
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
        // Authenticator
        Route::middleware(['auth:sanctum', 'auth.active'])->group(function () {
            // Xem sản phẩm giỏ hàng
            Route::get('/carts', 'carts');
        });

        Route::get('/', 'index');
        Route::get('/{id}', 'show');
        Route::get('/{id}/orders', 'orders');
        Route::get('/{id}/vouchers', 'vouchers');
        Route::get('/{id}/favorites', 'favorites');
        Route::get('/{id}/product-feedbacks', 'productFeedbacks');
    });


    /*
    |--------------------------------------------------------------------------
    | CartController
    |--------------------------------------------------------------------------
    */
    Route::prefix('carts')->controller(CartController::class)->group(function () {
        // Authenticator
        Route::middleware(['auth:sanctum', 'auth.active'])->group(function () {
            // Thêm sản phẩm giỏ hàng
            Route::post('/', 'addCart');

            // Cập nhật số lượng sản phẩm
            Route::put('/{product_id}', 'updateCart');

            // Xóa sản phẩm khỏi giỏ hàng
            Route::delete('/{product_id}', 'deleteCart');

            // Xóa toàn bộ sản phẩm giỏ hàng
            Route::delete('/', 'deleteAllCart');
        });
    });
});
