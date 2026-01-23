<?php

namespace App\OAuth\Servers;

use App\Models\OAuthIdentity;
use App\Models\User;
use App\OAuth\AbstractOAuthServer;
use App\OAuth\Exceptions\OAuthException;
use Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Str;

class GoogleServer extends AbstractOAuthServer 
{
    public function __construct()
    {
        $this->provider = 'google';
    }

    // private function getEndpoint(string $endpoint)
    // {
    //     $cacheKey = 'oauth.discovery.google';

    //     $endpoints = Cache::remember($cacheKey, now()->addDay(), function () use ($cacheKey)
    //     {
    //         $response = Http::get(config('oauth.providers.google.endpoints.discovery'));

    //         if ($response->failed()) 
    //         {
    //             throw new OAuthException(__('oauth.unexpected'), 500);
    //         }

    //         $ttl = 3600;
    //         if ($response->hasHeader('Cache-Control')) 
    //         {
    //             if (preg_match('/max-age=(\d+)/', $response->header('Cache-Control'), $m)) 
    //             {
    //                 $ttl = (int) $m[1];
    //             }
    //         }

    //         Cache::put($cacheKey, $response->json(), now()->addSeconds($ttl));


    //         return $response->json();
    //     });

    //     return match ($endpoint) {
    //         default => throw new OAuthException(__('oauth.unexpected'), 500)
    //     };
    // }

    public function getUriScope(string $action): string 
    {
        return config('oauth.providers.' . $this->provider . '.actions.' . $action . '.scope');
    }

     public function generateUserRedirectUri(string $action): string 
     {
        return parent::generateBaseUserRedirectUri($action)
        // . "&prompt=select_account"
        ;
     }


    // For google, we can perform some extra validation because it returns the scope and the 'prompt'
    public function validateUriEncondedState(string $state): array
    {
        $arrayState = parent::validateUriEncondedState($state);
        
        // if ($arrayState['prompt'] != "consent")
        // {
        //     throw new OAuthException(__('oauth.unauthorized'), 401);                                               
        // }

        // $providedScopes = explode(' ', trim($arrayState['scope']));
        // $requiredScopes = explode(' ', trim(config('oauth.providers.google.actions.' . $arrayState['action'] . '.scope')));
        // if (!empty(array_diff($requiredScopes, $providedScopes))) 
        // {
        //     throw new OAuthException(__('oauth.unauthorized'), 401);
        // }

        return $arrayState;
    }

    protected function parseUserData(array $serverData): array
    {
        return [
            'name' => $serverData['name'],
            'id' => $serverData['sub'],
            'email' => $serverData['email'],
            'avatar' => $serverData['picture']
        ];
    }
}