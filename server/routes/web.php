<?php

use App\Http\Controllers\Admin\Address\AddressController;
use App\Http\Controllers\Admin\Auth\AuthController;
use App\Http\Controllers\Admin\Blog\BlogController;
use App\Http\Controllers\Admin\Blog\TagController;
use App\Http\Controllers\Admin\Category\CategoryController;
use App\Http\Controllers\Admin\Combo\ComboController;
use App\Http\Controllers\Admin\Dashboard\DashboardController;
use App\Http\Controllers\Admin\Module\ModuleController;
use App\Http\Controllers\Admin\Order\OrderController;
use App\Http\Controllers\Admin\Product\FeedbackController;
use App\Http\Controllers\Admin\Product\ProductController;
use App\Http\Controllers\Admin\Product\VariantController;
use App\Http\Controllers\Admin\Role\RoleController;
use App\Http\Controllers\Admin\Setting\SettingController;
use App\Http\Controllers\Admin\Slider\SliderController;
use App\Http\Controllers\Admin\Admin\AdminController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Admin\Voucher\VoucherController;
use App\Http\Controllers\Admin\Permission\PermissionController;
use App\Http\Controllers\Admin\ProfileController;
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

Route::middleware('guest:admin')->group(function() {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'loginStore'])->name('login.store');
});

Route::middleware('auth:admin')->group(function() {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});

Route::prefix('/admin')->as('admin.')->middleware('auth:admin')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('product', ProductController::class);
    Route::resource('category', CategoryController::class);
    Route::resource('user', UserController::class);
    Route::resource('admin', AdminController::class);
    Route::resource('order', OrderController::class);
    Route::resource('feedback-product', FeedbackController::class);
    Route::resource('blog', BlogController::class);
    Route::resource('tag', TagController::class);
    Route::resource('voucher', VoucherController::class);
    Route::resource('variant', VariantController::class);
    Route::resource('slider', SliderController::class);
    Route::resource('permission', PermissionController::class);
    Route::resource('role', RoleController::class);
    Route::resource('module', ModuleController::class);
    Route::resource('combo', ComboController::class);
    // Route::resource('profile', ProfileController::class);
    
    // Setting
    Route::prefix('setting')->as('setting.')->controller(SettingController::class)->group(function () {
        // chung
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name(name: 'store');


        Route::post('/support', 'supportStore')->name('support.store');

        // Footer
        Route::get('/footer', 'footer')->name('footer.index');
        
        // Header
        Route::get('/header', 'header')->name('header.index');

        // About
        Route::get('/about', 'about')->name('about.index');

        // Contact
        Route::get('/contact', 'contact')->name('contact.index');
    });


    // Loctions

    Route::get('provinces', [AddressController::class, 'getProvinces'])->name('provinces');
    Route::get('districts', [AddressController::class, 'getDistrictsByProvince'])->name('districts');
    Route::get('ward', [AddressController::class, 'getWardsByDistrict'])->name('wards');
});

Route::post('/save-theme', function (Request $request) {
    $theme = $request->input('theme');
    Session::put('theme', $theme);
    return response()->json(['status' => 'success', 'theme' => $theme]);
});

Route::fallback(function() {
    return redirect()->route('admin.dashboard');
});