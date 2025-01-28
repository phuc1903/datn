<?php

use App\Http\API\V1\Category\CategoryController;
use App\Http\API\V1\Product\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
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
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{id}', [ProductController::class, 'getProduct']);
    Route::get('/category/{id}', [ProductController::class, 'getProductByCategory']);
});



Route::get('category',[CategoryController::class,'index']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
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
