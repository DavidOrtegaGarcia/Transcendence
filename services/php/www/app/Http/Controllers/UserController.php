<?php

namespace App\Http\Controllers;

use App\Enums\Language;
use App\Enums\OrderDirection;
use App\Http\Resources\UserCollection;
use App\Models\OAuthExchange;
use App\Models\User;
use App\OAuth\Contracts\OAuthServer;
use App\OAuth\Factories\OAuthServerFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController
{
    public function getUser(Request $request, User $user)
    {
        return response()->json($user->toResource(), 200);
    }

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

    public function getOwnUser(Request $request)
    {
        return response()->json(auth()->user()->toResource(), 200);
    }

    public function updateOwnPassword(Request $request)
    {
        $request->validate(['password' =>  ['required', 'string', Password::default()]]);

        auth()->user()->forceFill([
            'password' => Hash::make($request['password']),
        ])->save();

        return response()->json(auth()->user()->toResource(), 200);
    }

    public function updateUser(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'username' => ['nullable', 'string', 'max:255'],
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'bio' => [
                'nullable',
                'string',
                'max:255',
            ],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'language' => ['nullable', Rule::enum(Language::class)]
        ]);

        $user->fill([
            'name' => $data['username'] ?? $user->name,
            'email' => $data['email'] ?? $user->email,
            'bio' => $data['bio'] ?? $user->bio,
            'language' => $data['language'] ?? $user->language,
        ]);

        if ($request->hasFile('avatar')) 
        {
            $user->updateAvatar($request['avatar']);
        }

        $user->save();

        return response()->json(auth()->user()->toResource(), 200);
    }
}