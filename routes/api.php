<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CrimeController;
use App\Http\Controllers\Api\GeoController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Support\Facades\Route;

// Public
Route::get('crimes', [CrimeController::class, 'index']);
Route::get('crimes/{id}', [CrimeController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('stats/summary', [StatsController::class, 'summary']);
Route::get('stats/categories', [StatsController::class, 'byCategory']);
Route::get('stats/provinces', [StatsController::class, 'byProvince']);
Route::get('stats/trend', [StatsController::class, 'monthlyTrend']);
Route::get('geo/nearby', [GeoController::class, 'nearby']);
Route::get('geo/heatmap', [GeoController::class, 'heatmap']);

// Authenticated
Route::middleware('auth:sanctum')->group(function () {
    Route::post('crimes', [CrimeController::class, 'store']);
    Route::put('crimes/{crime}', [CrimeController::class, 'update']);
    Route::delete('crimes/{crime}', [CrimeController::class, 'destroy']);
    Route::post('crimes/{id}/verify', [CrimeController::class, 'verify']);
});
