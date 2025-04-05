<?php

use App\Http\Controllers\Admin\Address\AddressController;
use App\Http\Controllers\Admin\Auth\AuthController;
use App\Http\Controllers\Admin\Auth\TwoFactorController;
use App\Http\Controllers\Admin\Blog\BlogController;
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
use App\Http\Controllers\Admin\Tag\TagController;
use App\Http\Controllers\Admin\User\UserController;
use App\Http\Controllers\Admin\Voucher\VoucherController;
use App\Http\Controllers\Admin\Permission\PermissionController;
use App\Models\Order;
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

Route::middleware('guest:admin')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/login', [AuthController::class, 'loginStore'])->name('login.store');

});

Route::middleware('auth:admin')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Route::get('/2fa/setup', [TwoFactorController::class, 'showSetupForm'])->name('2fa.setup');
    // Route::post('/2fa/setup', [TwoFactorController::class, 'enable'])->name('2fa.enable');

    // Route::get('/2fa/verify', [TwoFactorController::class, 'showVerifyForm'])->name('2fa.verify');
    // Route::post('/2fa/verify', [TwoFactorController::class, 'verifyCode'])->name('2fa.verify.post');

});

Route::prefix('/admin')->as('admin.')->middleware('auth:admin')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Sản phẩm
    Route::prefix('product')->as('product.')->controller(ProductController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewProduct')->name('index');
        Route::get('create', 'create')->middleware('permission:createProduct')->name('create');
        Route::post('/', 'store')->middleware('permission:viewProduct')->name('store');
        Route::get('{product}/edit', 'edit')->middleware('permission:updateProduct')->name('edit');
        Route::put('{product}', 'update')->middleware('permission:updateProduct')->name('update');
        Route::delete('{product}', 'destroy')->middleware('permission:deleteProduct')->name('destroy');
    });

    // Danh mục sản phẩm
    Route::prefix('category')->as('category.')->controller(CategoryController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewProductCategory')->name('index');
        Route::get('create', 'create')->middleware('permission:createProductCategory')->name('create');
        Route::post('/', 'store')->middleware('permission:createProductCategory')->name('store');
        Route::get('{category}/edit', 'edit')->middleware('permission:updateProductCategory')->name('edit');
        Route::put('{category}', 'update')->middleware('permission:updateProductCategory')->name('update');
        Route::delete('{category}', 'destroy')->middleware('permission:deleteProductCategory')->name('destroy');
    });

    // Khách hàng
    Route::prefix('user')->as('user.')->controller(UserController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewUser')->name('index');
        Route::get('{user}/edit', 'edit')->middleware('permission:updateUser')->name('edit');
        Route::put('{user}', 'update')->middleware('permission:updateUser')->name('update');
    });

    /// Thành viên (admin)
    Route::prefix('admin')->as('admin.')->controller(AdminController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewAdmin')->name('index');
        Route::get('create', 'create')->middleware('permission:createAdmin')->name('create');
        Route::post('/', 'store')->middleware('permission:createAdmin')->name('store');
        Route::get('{admin}/edit', 'edit')->middleware('permission:updateAdmin')->name('edit');
        Route::put('{admin}', 'update')->middleware('permission:updateAdmin')->name('update');
        Route::delete('{admin}', 'destroy')->middleware('permission:deleteAdmin')->name('destroy');
    });

    // Đơn hàng
    Route::prefix('order')->as('order.')->controller(OrderController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewOrder')->name('index');
        Route::get('{order}/edit', 'edit')->middleware('permission:updateOrder')->name('edit');
        Route::put('{order}', 'update')->middleware('permission:updateOrder')->name('update');
    });

    // Đánh giá sản phẩm
    Route::prefix('feedback-product')->as('feedback-product.')->controller(FeedbackController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewProductFeedback')->name('index');
        Route::get('{product_feedbacks}/edit', 'edit')->middleware('permission:updateProductFeedback')->name('edit');
        Route::put('{product_feedbacks}', 'update')->middleware('permission:updateProductFeedback')->name('update');
    });

    // Thuộc tính sản phẩm
    Route::prefix('variant')->as('variant.')->controller(VariantController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewProductAttribute')->name('index');
        Route::get('create', 'create')->middleware('permission:createProductAttribute')->name('create');
        Route::post('/', 'store')->middleware('permission:createProductAttribute')->name('store');
        Route::get('{variant}/edit', 'edit')->middleware('permission:updateProductAttribute')->name('edit');
        Route::put('{variant}', 'update')->middleware('permission:updateProductAttribute')->name('update');
        Route::delete('{variant}', 'destroy')->middleware('permission:deleteProductAttribute')->name('destroy');
        Route::get('{variant}', 'show')->middleware('permission:viewProductAttribute')->name('show');
    });

    // Combo
    Route::prefix('combo')->as('combo.')->controller(ComboController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewCombo')->name('index');
        Route::get('create', 'create')->middleware('permission:createCombo')->name('create');
        Route::post('/', 'store')->middleware('permission:createCombo')->name('store');
        Route::get('{combo}/edit', 'edit')->middleware('permission:updateCombo')->name('edit');
        Route::put('{combo}', 'update')->middleware('permission:updateCombo')->name('update');
        Route::delete('{combo}', 'destroy')->middleware('permission:deleteCombo')->name('destroy');
    });

    // SEO (bài viết)
    Route::prefix('blog')->as('blog.')->controller(BlogController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewPost')->name('index');
        Route::get('create', 'create')->middleware('permission:createPost')->name('create');
        Route::post('/', 'store')->middleware('permission:createPost')->name('store');
        Route::get('{blog}/edit', 'edit')->middleware('permission:updatePost')->name('edit');
        Route::put('{blog}', 'update')->middleware('permission:updatePost')->name('update');
        Route::delete('{blog}', 'destroy')->middleware('permission:deletePost')->name('destroy');
    });

    // Danh mục bài viết
    Route::prefix('tag')->as('tag.')->controller(TagController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewPostCategory')->name('index');
        Route::get('create', 'create')->middleware('permission:createPostCategory')->name('create');
        Route::post('/', 'store')->middleware('permission:createPostCategory')->name('store');
        Route::get('{tag}/edit', 'edit')->middleware('permission:updatePostCategory')->name('edit');
        Route::put('{tag}', 'update')->middleware('permission:updatePostCategory')->name('update');
        Route::delete('{tag}', 'destroy')->middleware('permission:deletePostCategory')->name('destroy');
    });

    // Voucher
    Route::prefix('voucher')->as('voucher.')->controller(VoucherController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewVoucher')->name('index');
        Route::get('create', 'create')->middleware('permission:createVoucher')->name('create');
        Route::post('/', 'store')->middleware('permission:createVoucher')->name('store');
        Route::get('{voucher}/edit', 'edit')->middleware('permission:updateVoucher')->name('edit');
        Route::put('{voucher}', 'update')->middleware('permission:updateVoucher')->name('update');
        Route::delete('{voucher}', 'destroy')->middleware('permission:deleteVoucher')->name('destroy');
    });

    // Slider
    Route::prefix('slider')->as('slider.')->controller(SliderController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewSlider')->name('index');
        Route::get('create', 'create')->middleware('permission:createSlider')->name('create');
        Route::post('/', 'store')->middleware('permission:createSlider')->name('store');
        Route::get('{slider}/edit', 'edit')->middleware('permission:updateSlider')->name('edit');
        Route::put('{slider}', 'update')->middleware('permission:updateSlider')->name('update');
        Route::delete('{slider}', 'destroy')->middleware('permission:deleteSlider')->name('destroy');
    });

    // Phân quyền
    Route::prefix('permission')->as('permission.')->controller(PermissionController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewPermission')->name('index');
        Route::get('create', 'create')->middleware('permission:createPermission')->name('create');
        Route::post('/', 'store')->middleware('permission:createPermission')->name('store');
        Route::get('{permission}/edit', 'edit')->middleware('permission:updatePermission')->name('edit');
        Route::put('{permission}', 'update')->middleware('permission:updatePermission')->name('update');
        Route::delete('{permission}', 'destroy')->middleware('permission:deletePermission')->name('destroy');
    });
    Route::prefix('module')->as('module.')->controller(ModuleController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewPermission')->name('index');
        Route::get('create', 'create')->middleware('permission:createPermission')->name('create');
        Route::post('/', 'store')->middleware('permission:createPermission')->name('store');
        Route::get('{module}/edit', 'edit')->middleware('permission:updatePermission')->name('edit');
        Route::put('{module}', 'update')->middleware('permission:updatePermission')->name('update');
        Route::delete('{module}', 'destroy')->middleware('permission:deletePermission')->name('destroy');
    });

    // Vai trò
    Route::prefix('role')->as('role.')->controller(RoleController::class)->group(function () {
        Route::get('/', 'index')->middleware('permission:viewRole')->name('index');
        Route::get('create', 'create')->middleware('permission:createRole')->name('create');
        Route::post('/', 'store')->middleware('permission:createRole')->name('store');
        Route::get('{role}/edit', 'edit')->middleware('permission:updateRole')->name('edit');
        Route::put('{role}', 'update')->middleware('permission:updateRole')->name('update');
        Route::delete('{role}', 'destroy')->middleware('permission:deleteRole')->name('destroy');
    });

    // Setting
    Route::prefix('setting')->as('setting.')->controller(SettingController::class)->group(function () {
        // chung
        Route::get('/', 'index')->middleware('permission:viewSetting')->name('index');
        Route::post('/', 'store')->middleware('permission:createSetting')->name('store');
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

Route::fallback(function () {
    return redirect()->route('admin.dashboard');
});