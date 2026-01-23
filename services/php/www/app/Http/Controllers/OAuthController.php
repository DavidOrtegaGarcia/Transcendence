<?php

namespace App\Http\Controllers;

use App\Enums\OAuthActions;
use App\Enums\OAuthProviders;
use App\Models\OAuthExchange;
use App\OAuth\Contracts\OAuthServer;
use App\OAuth\Factories\OAuthServerFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Validation\Rule;

class OAuthController 
{
    public function getRedirectUri(Request $request, OAuthServerFactory $serverFactory)
    {
        $request->validate([
            'provider'  => ['required', Rule::enum(OAuthProviders::class)],
            'action' => ['required', Rule::enum(OAuthActions::class)],
        ]);

        $server = $serverFactory->make($request->input('provider'));
        $server->generateState($request->input('action'));
        $uri =  $server->generateUserRedirectUri($request->input('action'));
        return response()->json(['uri' => $uri]);
    }

    public function handleOAuthResponse(Request $request, string $provider, OAuthServerFactory $serverFactory)
    {
        // Error message is not localized and relatively unimportant. Also wont bother validating state or anything, not necessary.
        if ($request->input('error'))
        {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $server = new OAuthServerFactory()->make($provider);

        $requestState = $request->input('state');

        $state = $server->validateUriEncondedState($requestState);

        $oauthExhange = $server->exchangeCode($request->input('code'), $requestState);

        $response = $server->execute($state['action'],  $oauthExhange->access_token);

        return $response;
    }
}