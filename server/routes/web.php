<?php

use App\Http\Controllers\Admin\Blog\BlogController;
use App\Http\Controllers\Admin\Category\CategoryController;
use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\Order\OrderController;
use App\Http\Controllers\Admin\Product\FeedbackController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\Admin\Product\VariantController;
use App\Http\Controllers\Admin\Setting\SettingController;
use App\Http\Controllers\Admin\Slider\SliderController;
use App\Http\Controllers\Admin\Team\TeamController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Admin\Voucher\VoucherController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

Route::prefix('/admin')->as('admin.')->group(function () {
    Route::resource('product', ProductController::class);
    Route::resource('category', CategoryController::class);
    Route::resource('user', UserController::class);
    Route::resource('team', TeamController::class);
    // Route::delete('order/order-item/{orderItem}', [OrderController::class, 'destroyProductItem'])
    //     ->name('product.destroy');
    Route::resource('order', OrderController::class);
    Route::resource('feedback-product', FeedbackController::class);
    Route::resource('setting', SettingController::class);
    Route::resource('blog', BlogController::class);
    Route::resource('voucher', VoucherController::class);
    Route::resource('variant', VariantController::class);
    Route::resource('slider', SliderController::class);
});

Route::post('/save-theme', function (Request $request) {
    $theme = $request->input('theme');
    Session::put('theme', $theme);
    return response()->json(['status' => 'success', 'theme' => $theme]);
});

// Auth::routes();
