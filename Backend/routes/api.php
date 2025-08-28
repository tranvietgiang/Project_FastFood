<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\CouponsController;
use App\Http\Controllers\FeatureDeleteController;
use App\Http\Controllers\FeatureSearchController;
use App\Http\Controllers\ProductController;


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
