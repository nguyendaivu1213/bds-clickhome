<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\PostController as AdminPostController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\InvestorController as AdminInvestorController;
use App\Http\Controllers\Api\Admin\SettingController as AdminSettingController;
use App\Http\Controllers\Api\Admin\MediaController as AdminMediaController;
use App\Http\Controllers\Api\Admin\FolderController as AdminFolderController;
use App\Http\Controllers\Api\Admin\ProjectZoneController as AdminProjectZoneController;

use App\Http\Controllers\Api\Frontend\HomeController;
use App\Http\Controllers\Api\Frontend\ProjectController;
use App\Http\Controllers\Api\Frontend\PostController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1/admin')->group(function () {
    Route::apiResource('projects', AdminProjectController::class);
    Route::apiResource('posts', AdminPostController::class);
    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('investors', AdminInvestorController::class);
    Route::get('settings', [AdminSettingController::class, 'index']);
    Route::post('settings', [AdminSettingController::class, 'store']);
    Route::apiResource('media', AdminMediaController::class);
    Route::apiResource('folders', AdminFolderController::class);
    Route::apiResource('zones', AdminProjectZoneController::class);
});

Route::prefix('v1/public')->group(function () {
    Route::get('home', [HomeController::class, 'index']);
    Route::apiResource('projects', ProjectController::class)->only(['index', 'show']);
    Route::apiResource('posts', PostController::class)->only(['index', 'show']);
});
