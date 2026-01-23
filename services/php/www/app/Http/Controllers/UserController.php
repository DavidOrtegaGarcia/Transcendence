<?php

namespace App\Http\Controllers;

use App\Enums\OrderDirection;
use App\Http\Resources\UserCollection;
use App\Models\OAuthExchange;
use App\Models\User;
use App\OAuth\Contracts\OAuthServer;
use App\OAuth\Factories\OAuthServerFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rule;

class UserController
{
    public function getUsers(Request $request)
    {
        $validated = $request->validate([
            'page_size' => ['sometimes', 'integer', 'min:1', 'max:'.config('social.max_page_size')],
            'page' => ['sometimes', 'integer', 'min:1'],
            'sort_order' => ['sometimes', Rule::enum(OrderDirection::class)],
        ]);

        $pageSize = $request->integer('page_size', config('social.default_page_size'));
        $page = $request->integer('page', 1);
        $sortOrder =  $request->enum('sort_order', OrderDirection::class, OrderDirection::DESC);
        
        $users = User::orderBy('created_at', $sortOrder->value)->paginate($pageSize, ['*'], 'page', $page);
        
        return $users->toResourceCollection();
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->noContent();
    }
}