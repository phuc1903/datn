<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticatorController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\Slider\SliderController;
use App\Http\Controllers\Api\V1\User\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Order\OrderController;

// Version 1
Route::prefix('v1')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | ProductController
    |--------------------------------------------------------------------------
    */
    Route::prefix('products')->controller(ProductController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}', 'getProduct');
        Route::get('/category/{id}', 'getProductByCategory');
    });


    /*
    |--------------------------------------------------------------------------
    | CategoryController
    |--------------------------------------------------------------------------
    */
    Route::prefix('categories')->controller(CategoryController::class)->group(function () {
        Route::get('/', 'index');
    });

    /*
        |--------------------------------------------------------------------------
        | SliderController
        |--------------------------------------------------------------------------
        */
    Route::prefix('sliders')->controller(SliderController::class)->group(function () {
        Route::get('/', 'index');
    });
    /*
        |--------------------------------------------------------------------------
        | OrderController
        |--------------------------------------------------------------------------
        */
    Route::prefix('orders')->controller(OrderController::class)->group(function (){
        Route::middleware('auth:sanctum')->group(function (){
            Route::get('/','getUserOrder');
            Route::post('create', 'createOrder');
            Route::get('/{id}','orderUserDetail');
        });
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
});
