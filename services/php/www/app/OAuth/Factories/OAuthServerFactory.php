<?php

namespace App\OAuth\Factories;

use App\OAuth\Contracts\OAuthServer;
use InvalidArgumentException;

class OAuthServerFactory 
{
    public function make(string $provider): OAuthServer
    {
        $providers = config('oauth.providers');

        if (!isset($providers[$provider])) 
        {
            throw new InvalidArgumentException("Unsupported provider: $provider");
        }

        return app($providers[$provider]['server']);
    }
}