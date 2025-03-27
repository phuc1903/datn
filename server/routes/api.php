<?php

use App\Http\Controllers\Api\V1\Auth\AuthenticatorController;
use App\Http\Controllers\Api\V1\Blog\BlogController;
use App\Http\Controllers\Api\V1\Cart\CartController;
use App\Http\Controllers\Api\V1\Category\CategoryController;
use App\Http\Controllers\Api\V1\Product\ProductController;
use App\Http\Controllers\Api\V1\Slider\SliderController;
use App\Http\Controllers\Api\V1\User\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Order\OrderController;
use App\Http\Controllers\Api\V1\Voucher\VoucherController;
use App\Http\Controllers\Api\V1\ProductFeedback\ProductFeedbackController;
use App\Http\Controllers\Api\V1\Address\AddressController;
use App\Http\Controllers\Api\V1\Combo\ComboController;
use App\Http\Controllers\Api\V1\Setting\SettingController;

// Version 1
Route::prefix('v1')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | AddressController
    |--------------------------------------------------------------------------
    */
    Route::get('/get-location-in-vn',[AddressController::class,'index']);


    /*
    |--------------------------------------------------------------------------
    | ProductController
    |--------------------------------------------------------------------------
    */
    Route::prefix('products')->controller(ProductController::class)->group(function () {
        Route::get('/', 'getAllProduct');
        Route::get('/detail/{id}', 'getProduct');
        Route::get('/category/{id}', 'getProductByCategory');
        Route::get('/tag/{id}', 'getProductByTag');
        Route::get('/most-favorites','getMostFavoritedProducts');
        Route::get('/feedback-product/{id}', 'getFeedBackProduct');
        Route::get('/product-related/{id}', 'getProductRelated');
        Route::get('/skus/{id}', 'getSkus')->name('api.get.skus.product');

        Route::middleware(['auth:sanctum','auth.active'])->group(function () {
            Route::get('/also-like/', 'getProductAlsoLike');
        });
    });
    /*
        |--------------------------------------------------------------------------
        | ProductController
        |--------------------------------------------------------------------------
        */
    Route::prefix('combos')->controller(ComboController::class)->group(function () {
        Route::get('/', 'getAllCombo');
        Route::get('/detail/{id}', 'getCombo');
        Route::get('/nearly-start', 'nearlyStart');
        Route::get('/nearly-end', 'nearlyEnd');

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
    Route::prefix('orders')->controller(OrderController::class)->group(function () {
        Route::middleware(['auth:sanctum','auth.active'])->group(function () {
            Route::post('/create', 'createOrder');
            Route::get('/{id}', 'orderUserDetail');
        });
        Route::post('/payment/momo/ipn', 'handleMomoIpn');  // Nhận callback từ MOMO
    });

    /*
    |--------------------------------------------------------------------------
    | ProductFeedbackController
    |--------------------------------------------------------------------------
    */
    Route::prefix('product_feedbacks')->controller(ProductFeedbackController::class)->group(function (){
        Route::middleware(['auth:sanctum','auth.active'])->group(function (){
            Route::get('getAllOrderItem', 'getAllOrderItem');
            Route::post('create','create');
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

        // Google
        Route::post('/login/google', 'loginGoogle');
        Route::get('/google/callback', 'handleGoogleCallback');

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
            Route::get('/orders', 'orders');
            Route::get('/favorites', 'favorites');
            Route::post('/add-favorite', 'addToFavorites');
            Route::post('/remove-favorite', 'removeFromFavorites');

            // Danh sách vouchers
            Route::get('/vouchers', 'vouchers');

            //  Danh sách địa chỉ
            Route::get('/addresses','getAddressUser');
            Route::post('/add-addresses', 'addAddressUser');
            Route::put('/update-addresses', 'updateAddressUser');
            Route::delete('/delete-addresses', 'deleteAddressUser');

        });

        Route::get('/', 'index');
        Route::get('/{id}', 'show');
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


    /*
    |--------------------------------------------------------------------------
    | BlogController
    |--------------------------------------------------------------------------
    */
    Route::prefix('blogs')->controller(BlogController::class)->group(function () {
        // Lấy tất cả các blog
        Route::get('/', 'getAllBlogs');

        // Lấy chi tiết blog theo ID
        Route::get('/{blog_id}', 'getDetailBlog');
    });


    /*
    |--------------------------------------------------------------------------
    | VoucherController
    |--------------------------------------------------------------------------
    */
    Route::prefix('vouchers')->controller(VoucherController::class)->group(function () {
        // Lấy tất cả Voucher
        Route::get('/', 'getAllVouchers');

        // Lấy chi tiết Voucher
        Route::get('/{id}', 'getDetailVouchers');

        // Authenticator
        Route::middleware(['auth:sanctum', 'auth.active'])->group(function () {
            // Nhận Voucher
            Route::post('/{id}/claim', 'claimVouchers');
        });
    });

    Route::prefix('settings')->controller(SettingController::class)->group(function() {
        Route::get('/', 'getAllSettings');
    });
});
