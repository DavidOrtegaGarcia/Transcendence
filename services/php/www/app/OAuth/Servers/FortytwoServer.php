<?php

namespace App\OAuth\Servers;

use App\OAuth\AbstractOAuthServer;
use App\OAuth\Exceptions\OAuthException;
use Illuminate\Support\Facades\Http;

class FortytwoServer extends AbstractOAuthServer 
{
    public function __construct()
    {
        $this->provider = 'fortytwo';
    }


    public function getUriScope(string $action): string 
    {
        return config('oauth.providers.' . $this->provider . '.actions.' . $action . '.scope');
    }

    public function generateUserRedirectUri(string $action): string 
    {
        return parent::generateBaseUserRedirectUri($action);
    }

    protected function parseUserData(array $serverData): array
    {
        return [
            'name' => $serverData['login'],
            'id' => $serverData['id'],
            'email' => $serverData['email'],
            'avatar' => $serverData['image']['link']
        ];
    }
}