<?php

use App\Http\Controllers\FriendshipController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\MediaController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {return $request->user();});

    /**
     * Friend system
     * Chat system (Friend and ingame)
     * User profiles
     * Profile updates
     * 
     * Games
     * Tournaments
     * Game statistics
     * Match history
     * User game stadistics
     * Achievements
     * Progression
     * Leaderboards
     * Badges
     * 
     */
    Route::prefix('/v1')->group(function () {
        // Own user
        Route::get('/user', [UserController::class, 'getOwnUser']);
        Route::patch('/user/update', [UserController::class, 'updateUser']);
        Route::put('/user/password/update', [UserController::class, 'updateOwnPassword']);
    
        // User
        Route::get('/users', [UserController::class, 'getUsers']);
        Route::get('/users/{user}', [UserController::class, 'getUser']);
        // Route::get('/users/{id}/friends', [UserController::class, 'getUser']);
        // Route::get('/users/{id}/games', [UserController::class, 'getUser']);
        // Route::get('/users/{id}/chats', [UserController::class, 'getUser']);
        // Route::get('/users/{id}/achievements', [UserController::class, 'getUser']);
        // Route::patch('/users/{id}', [UserController::class, 'getUser']);
        // Route::delete('/users/{id}', [UserController::class, 'getUser']);

        // Friendship
        Route::post('/users/{user}/friends/{friend}', [FriendshipController::class, 'sendFriendRequest']);
        Route::patch('/users/{user}/friends/{friend}', [FriendshipController::class, 'updateFriendship']);
        Route::delete('/users/{user}/friends/{friend}', [FriendshipController::class, 'deleteFriendship']);

        // Chat
        // Route::get('/chats/{chat}', [ChatController::class, 'getChat']); // Guests might be able to read chats, make it public.
        Route::post('/chats/{chat}/messages', [ChatController::class, 'postMessage']);
        Route::patch('/messages/{message}', [ChatController::class, 'editMessage']);
        Route::post('/messages/{message}/read', [ChatController::class, 'readMessage']);

        // Games
        // Route::get('/games', [UserController::class, 'getUser']);
        // Route::get('/games/{id}', [UserController::class, 'getUser']);
        Route::post('/games', [GameController::class, 'createGame']);
        // Route::put('/games/{id}', [UserController::class, 'getUser']);

        // Achivements
        // Route::get('/achievements', [UserController::class, 'getUsers']);
        // Route::get('/achievements/{id}/users', [UserController::class, 'getUsers']);
        // Route::put('/achievements/{id}/users/{user_id}', [UserController::class, 'getUsers']);

        // Tournaments
        // Route::get('/tournaments', [UserController::class, 'getUsers']);
        // Route::get('/tournaments/{id}', [UserController::class, 'getUsers']);
        // Route::post('/tournaments', [UserController::class, 'getUsers']);
        // Route::delete('/tournaments/{id}', [UserController::class, 'getUsers']);
        // Route::patch('/tournaments/{id}', [UserController::class, 'getUsers']);

        // Other
        // Route::get('/leaderboard', [UserController::class, 'getUsers']);
    });

});

Route::get('/v1/chats/{chat}', [ChatController::class, 'getChat']);

Route::get(config('oauth.uri_generation'), [OAuthController::class, 'getRedirectUri']);

Route::post(config('oauth.redirected').'/{provider}', [OAuthController::class, 'handleOAuthResponse']);

Route::get('/media/{path}', [MediaController::class, 'getMedia'])->where('path', '.*');
