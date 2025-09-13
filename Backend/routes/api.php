<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CouponsController;
use App\Http\Controllers\FeatureAddController;
use App\Http\Controllers\FeatureDeleteController;
use App\Http\Controllers\FeatureSearchController;
use App\Http\Controllers\PaymentBuynowController;
use App\Http\Controllers\ProductController;

/**Auth */
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/otp', [AuthController::class, 'verifyOtp']);

/*Feature search */
Route::get('/product/{cateSearch}', [FeatureSearchController::class, 'searchCate']);
Route::get('/userInput', [FeatureSearchController::class, 'userSearch']);
Route::get('/cate/{cateSearch}', [FeatureSearchController::class, 'search']);
Route::get('/history-list', [FeatureSearchController::class, 'getHistory']);
Route::post('/history', [FeatureSearchController::class, 'saveHistory']);
Route::get('/historySearch/{dataHistory}', [FeatureSearchController::class, 'historySearch']);
Route::get('/product/history/{dataHistory}', [FeatureSearchController::class, 'productHistory']);

/*Feature delete */
Route::delete('/delete/{idDelete}', [FeatureDeleteController::class, 'deleteHistory']);

/* Cate */
Route::get('/getCate', [CategorieController::class, 'getCate']);

/**Coupon */
Route::get("/getCoupon", [CouponsController::class, "getCoupon"]);

/**Product */
Route::get("/getProduct", [ProductController::class, "getProductSection2"]);
Route::get("/getProduct3", [ProductController::class, "getProductSection3"]);

/*ShowAll */
Route::get("/showAll/section", [ProductController::class, "getShowAllSection3"]);
Route::get("/showAll/section/option", [ProductController::class, "getShowAllSection3Option"]);

/**Chào ngày mới */
Route::get("/showAll/section4", [ProductController::class, "getProductsSection4"]);

/**Product detail */
Route::get("/products/detail/by-id/{id}", [ProductController::class, "getProductsDetail"]);

/*Product drin */
Route::get("/products/drink-together", [ProductController::class, "getDrinkGoTogether"]);

/*Product detail related */
Route::get("/products/related/by-id/{idDetail}", [ProductController::class, "getProductRelated"]);

/*Product detail user views recently */
Route::get("/products/view-recently/by-id/{idViewRecently}", [ProductController::class, "getProductViewRecently"]);

/*Find-add-Compare */
Route::get("/products/add-compare/by-id/{compareId}", [FeatureAddController::class, "AddCompareId"]);

/*Delete compare */
Route::get("/products/delete-compare/by-id/{compareId}/{userId}", [FeatureDeleteController::class, "deleteCompareId"]);

/*Delete compare-all */
Route::get("/products/delete-compare-all/by-id/{userId}", [FeatureDeleteController::class, "deleteCompareAll"]);

/*Ingredients compare-all*/
Route::get("/products/compare-ingredients/by-id/{userId}", [ProductController::class, "compareIngredients"]);

/* Get Discount*/
Route::get("/getDiscount", [ProductController::class, "getDiscount"]);

/* user enter code discount price final*/
Route::get("/enter-the-coupon/{code}", [ProductController::class, "enterTheCoupon"]);

/* insert code coupon*/
Route::middleware('auth:sanctum')->post('/insert-coupon/{copiedId}', [FeatureAddController::class, 'insertCouponUser']);

/* insert code coupon*/
Route::get('/get-coupon-user', [ProductController::class, 'getCouponUser']);

/*********************************  payment buy now          ********************/
Route::post('/checkout/buy-now', [PaymentBuyNowController::class, 'buyNow']);
/* payment buy now zalo*/
Route::post('/zalo/check-zalo', [PaymentBuyNowController::class, 'checkZalo']);
/* payment buy now vnpay*/
Route::post('/vnpay/check-vnpay', [PaymentBuyNowController::class, 'checkVNpay']);
