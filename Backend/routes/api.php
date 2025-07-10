<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\FeatureSearchController;
use App\Http\Controllers\ProductController;

/* Cate */

Route::get('/getCate', [CategorieController::class, 'getCate']);

/*Feature search */
Route::get('/product/{cateSearch}', [FeatureSearchController::class, 'searchCate']);
Route::get('/userInput', [FeatureSearchController::class, 'userSearch']);
Route::get('/cate/{cateSearch}', [FeatureSearchController::class, 'search']);
Route::get('/history-list', [FeatureSearchController::class, 'getHistory']);
Route::post('/history', [FeatureSearchController::class, 'saveHistory']);