<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::middleware('auth:sanctum')->group(function () {
    // Group v1 definition
    Route::prefix('v1')->group(function () {
        // Route to get logged-in user data (Login)
        Route::get('/user', [UserController::class, 'getOwnUser']);
        
        // Actualization routes
        Route::patch('/user/update', [UserController::class, 'updateUser']);
        Route::put('/user/password', [UserController::class, 'updateOwnPassword']);
    });

    // Public profiles route
    Route::get('/users/{user}', [UserController::class, 'getUser']);
});