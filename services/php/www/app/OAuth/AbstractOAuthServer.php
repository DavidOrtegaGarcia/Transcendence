<?php

namespace App\OAuth;

use App\Models\OAuthExchange;

use App\OAuth\Contracts\OAuthServer;
use App\OAuth\Exceptions\OAuthException;
use App\Services\AccountService;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

abstract class AbstractOAuthServer implements OAuthServer 
{
    protected $provider;

     /**
     * To support multiple providers and actions on a single session (Innecesary),
     * this helper fabricates the session key of a state.
     */
    private function getStateSessionKey(string $action): string 
    {
        return "oauth_state_" . $this->provider . '_' . $action;
    }

    abstract public function getUriScope(string $action): string;

    /**
     * Generates the base URI common to all OAUTH servers. Extra parameters could be provided by the
     * concrete implementation.
     */
    protected function generateBaseUserRedirectUri(string $action): string
    {
        $s = config('oauth.providers.' . $this->provider . '.authorize') . '?' .
            http_build_query([
                'client_id' => config("oauth.providers.{$this->provider}.client_id"),
                'response_type' => 'code',
                'redirect_uri' => config('oauth.redirect').'/'.$this->provider,
                'state' => $this->getUriEncodedState($action),
                'scope' => $this->getUriScope($action),
            ]);
        return $s;
    }

    public function validateUriEncondedState(string $state): array
    {
        // $urlDecodedState = urldecode($state);
        
        try 
        {
            $decryptedState = Crypt::decryptString($state);
        }
        catch (DecryptException $e)
        {
            throw new OAuthException(__('oauth.unauthorized'), 401);
        }

        $jsonDecodedState = json_decode($decryptedState, true);
        if ($jsonDecodedState != session($this->getStateSessionKey($jsonDecodedState['action'])))
        {
            throw new OAuthException(__('oauth.unauthorized'), 401);
        }

        // if (time() - $jsonDecodedState['time'] > config("oauth.providers.{$this->provider}.state_expiration_time")) {
        //     throw new OAuthException(__('oauth.expired'), 404);
        // }

        return $jsonDecodedState;
    }

    public function getUriEncodedState(string $action): string
    {
        if (!session()->has($this->getStateSessionKey($action)))
        {
            throw new OAuthException(__('oauth.unauthorized'), 401);
        }

        $state = session($this->getStateSessionKey($action));
        $jsonEncodedState = json_encode($state);
        $encryptedState = Crypt::encryptString($jsonEncodedState);
        // $urlEncodedState = urlencode($encryptedState);
        return $encryptedState;
    }

    public function generateState(string $action): void
    {
        $state = [
            'action' => $action,
            'provider' => $this->provider,
            'csrf_token' => bin2hex(random_bytes(128/8)),
            'time' => time(),
        ];

        session([$this->getStateSessionKey($action) => $state]);
    }

    public function execute(string $action, string $access_token)
    {
        if (config('oauth.providers.' . $this->provider . '.actions.' . $action == null))
        {
            throw new OAuthException(__('oauth.unsupported'), 404);
        }
    
        switch ($action)
        {
            case 'login': return $this->login($access_token); break ;
            case 'link': return $this->link($access_token); break ;
            default: throw new OAuthException(__('oauth.unsupported') . ": " . $action, 404);
        }
    }

    /**
     *  42: 
        "access_token" => ""
        "token_type" => "bearer"
        "expires_in" => 
        "refresh_token" => ""
        "scope" => ""
        "created_at" => 
        "secret_valid_until" => 

        Google:
        "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
        "expires_in": 3920,
        "token_type": "Bearer",
        "scope": "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.readonly",
        "refresh_token": "1//xEoDL4iW3cxlI7yDbSRFYNG01kVKM2C-259HOF2aQbI"
     */
    public function exchangeCode($code, $state): OAuthExchange
    {
        $response = Http::asForm()->post(config('oauth.providers.'.$this->provider.'.token_exchange_endpoint'), [
            'code'          => $code,
            'client_id'     => config('oauth.providers.'.$this->provider.'.client_id'),
            'client_secret' => config('oauth.providers.'.$this->provider.'.client_secret'),
            'redirect_uri'  => config('oauth.redirect').'/'.$this->provider,
            'grant_type'    => 'authorization_code',
        ]);
        if ($response->failed()) 
        {
            report($response->toException());
            throw new OAuthException(__('oauth.unexpected'), 500);
        }
        $data = $response->json();

        $extra = collect($data)
            ->except(['access_token', 'refresh_token', 'expires_in', 'token_type'])
            ->toArray();
            
        $exchange = OAuthExchange::create([
            'provider'      => $this->provider,
            'authorization_code' => $code,
            'access_token'  => $data['access_token'],
            'refresh_token' => $data['refresh_token'] ?? null,
            'expires_at'    => isset($data['expires_in']) ? now()->addSeconds($data['expires_in']) : null,
            'extra'         => $extra,
        ]);
        if (!$exchange)
        {
            throw new OAuthException(__('oauth.unexpected'));
        }
        return $exchange;
    }

    abstract protected function parseUserData(array $serverData): array;

    public function login(string $access_token)
    {
        $response = Http::asForm()
            ->withHeader('Authorization', 'Bearer ' . $access_token)
            ->get(config('oauth.providers.'. $this->provider .'.endpoints.user_data'));
    
        if ($response->failed())
        {
            report($response->toException());
            throw new OAuthException(__('oauth.unexpected'), 500);
        }
    
        $userdata = $this->parseUserData($response->json());

        $accountProvider = new AccountService();
        
        return $accountProvider->oauthLogin($userdata['id'], $userdata['email'], $userdata['name'], $userdata['avatar'], $this->provider);
    }

    public function link(string $access_token)
    {
        $response = Http::asForm()
            ->withHeader('Authorization', 'Bearer ' . $access_token)
            ->get(config('oauth.providers.'. $this->provider .'.endpoints.user_data'));
    
        if ($response->failed())
        {
            report($response->toException());
            throw new OAuthException(__('oauth.unexpected'), 500);
        }
    
        $userdata = $this->parseUserData($response->json());

        $accountProvider = new AccountService();
        
        return $accountProvider->oauthLinkage(Auth::id(), $userdata['id'], $userdata['email'], $userdata['name'], $userdata['avatar'], $this->provider);
    }
}