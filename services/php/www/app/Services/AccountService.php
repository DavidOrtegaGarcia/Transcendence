<?php

namespace App\Services;

use App\Models\OAuthIdentity;
use App\Models\User;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use RuntimeException;

class AccountService 
{
    public function oauthLogin(string $provider_id, string $email, string $name, string $avatar, string $provider): JsonResponse
    {
        if (Auth::check())
        {
            abort(400);
        }

        return DB::transaction(function () use ($provider_id, $email, $name, $avatar, $provider) {
            $user = User::whereHas('oauthIdentities', function ($q) use ($provider_id, $provider) {
                $q->where('provider', $provider)
                ->where('provider_id', $provider_id);
            })
            ->first();

            if ($user)
            {
                Auth::guard('web')->login($user);
                return response()->json(['redirect' => '/home'], 200);
            }
        
            $existingUser = User::where('email', $email)->first();
            if ($existingUser)
            {
                return response()->json(['error' => __('oauth.email_used')], 403);
            }

            $user = User::create([
                'email' => $email,
                'name' => $name,
                'password' => Hash::make(Str::random(64)),
                'avatar' =>  $avatar,
            ]);
            if (!$user)
            {
                throw new RuntimeException(__('oauth.unexpected'), 500);
            }

            $identity = OAuthIdentity::create([
                'provider' => $provider,
                'provider_id' => $provider_id,
                'user_id' => $user->id
            ]);
            if (!$identity)
            {
                throw new RuntimeException(__('oauth.unexpected'), 500);
            }

            Auth::guard('web')->login($user);

            return response()->json(['redirect' => '/home'], 201);
        });
    }

    public function oauthLinkage(int $user_id, string $provider_id, string $email, string $name, string $avatar, string $provider): JsonResponse
    {
        if (Auth::id() !== $user_id)
        {
            abort(400);
        }

        $user = Auth::user();

        if (OAuthIdentity::where('provider', $provider)->where('user_id', $user_id)->exists())
        {
            return response()->json(['error' => __('oauth.already_linked')], 403);
        }

        $identity = OAuthIdentity::create([
            'provider' => $provider,
            'provider_id' => $provider_id,
            'user_id' => $user->id
        ]);
        if (!$identity)
        {
            throw new RuntimeException(__('oauth.unexpected'), 500);
        }

        return response()->json([], 201);
    }
}