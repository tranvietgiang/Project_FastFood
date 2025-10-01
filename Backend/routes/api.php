<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CouponsController;
use App\Http\Controllers\FeatureUpdateController;
use App\Http\Controllers\FeatureAddController;
use App\Http\Controllers\FeatureDeleteController;
use App\Http\Controllers\FeatureGetDataController;
use App\Http\Controllers\FeatureSearchController;
use App\Http\Controllers\PaymentBuynowController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\MessageController;

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
Route::post("/products/add-compare/by-id", [FeatureAddController::class, "AddCompareId"]);
Route::get("/products/compare-not-user/{productId}", [FeatureGetDataController::class, "GestProductId"]);
Route::post("/products/compare-list-guest", [FeatureGetDataController::class, "GestProductList"]);

/*Delete compare */
Route::delete("/products/delete-compare/by-id", [FeatureDeleteController::class, "deleteCompareId"]);

/*get compare */
Route::get("/products/get-compare-user/{userId}", [FeatureGetDataController::class, "getCompare"]);

/*Delete compare-all */
Route::delete("/products/delete-compare-all/by-id/{userId}", [FeatureDeleteController::class, "deleteCompareAll"]);

/*Ingredients compare-all*/
Route::get("/products/compare-ingredients/by-id/{userId}", [FeatureGetDataController::class, "compareIngredients"]);

/* Get Discount*/
Route::get("/getDiscount", [ProductController::class, "getDiscount"]);

/* user enter code discount price final*/
Route::get("/enter-the-coupon/{code}", [ProductController::class, "enterTheCoupon"]);

/* insert code coupon*/
Route::middleware('auth:sanctum')->post('/insert-coupon/{copiedId}', [FeatureAddController::class, 'insertCouponUser']);

/* get count coupon*/
Route::middleware("auth:sanctum")->get('/get-count-user', [FeatureGetDataController::class, 'countCoupon']);

/* user add heart*/
Route::post('/insert-heart-user', [FeatureAddController::class, 'insertHeartUser']);
/* user get add heart*/
Route::get('/get-list-heart/{userId}', [FeatureGetDataController::class, 'getListHeart']);
/* user delete heart*/
Route::middleware('auth:sanctum')->post('/delete/heart', [FeatureDeleteController::class, 'heartDelete']);

/* user get coupon*/
Route::get('/get-list-coupon/{userId}', [FeatureGetDataController::class, 'getListCoupon']);
/* user delete coupon*/
Route::middleware('auth:sanctum')
    ->post('/delete/coupon', [FeatureDeleteController::class, 'couponDelete']);

/* user get province*/
Route::get('/get-province', [AddressController::class, 'getProvince']);
/* user get getDistrict*/
Route::get('/get-district/{provinceId}', [AddressController::class, 'getDistrict']);
/* user get wards*/
Route::get('/get-ward/{districtId}', [AddressController::class, 'getWard']);
/* user inert-address*/
Route::post('/inert-address-user', [AddressController::class, 'inertAddress']);

/* user add-item-cart*/
Route::middleware("auth:sanctum")->post('/insert-cart-item', [FeatureAddController::class, 'insertCartItem']);

/* user get-cart*/
Route::middleware("auth:sanctum")->get('/get-cart', [FeatureGetDataController::class, 'Carts']);
/* user update-cart*/
Route::middleware("auth:sanctum")->post('/update-cart', [FeatureUpdateController::class, 'updateCarts']);

/* user update-cart*/
Route::middleware("auth:sanctum")->post('/delete-cart', [FeatureDeleteController::class, 'cartItemDelete']);

/* user inert-address*/
Route::get('/get-address', [AddressController::class, 'getAddress']);
/* user inert-address*/
Route::post('/inert-address-user', [AddressController::class, 'inertAddress']);

/*********************************  payment buy now          ********************/
Route::post('/checkout/buy-now', [PaymentBuyNowController::class, 'buyNow']);
/* payment buy now zalo*/
Route::post('/zalo/check-zalo', [PaymentBuyNowController::class, 'checkZalo']);
/* payment buy now vnpay*/
Route::post('/vnpay/check-vnpay', [PaymentBuyNowController::class, 'checkVNpay']);
/* payment buy now vnpay*/
Route::post('/momo/check-momo', [PaymentBuyNowController::class, 'checkMomo']);
/* user click send mail y*/
Route::middleware('auth:sanctum')->post('/send-bill', [PaymentBuyNowController::class, 'sendBill']);

// message
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/get-customer-care', [MessageController::class, 'getCustomerCare']);
});