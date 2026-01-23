<?php

namespace Tests\Feature;

use App\OAuth\Factories\OAuthServerFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use App\Services\OAuthService;
use Http;
use App;

/**
 * This 
 */
class OAuthURIGenerationTest extends TestCase
{
    public function test_google_uri_generation()
    {
        $providerName = 'google';
        $action = 'login';

        $response = $this->get(config('oauth.uri_generation') . '?' . http_build_query([
            'provider' => $providerName,
            'action' => $action 
        ]),[
                'accept' => 'application/json'
        ])
        ->assertOk();

        $uri = $response->json('uri');
        parse_str(parse_url($uri, PHP_URL_QUERY), $query);

        $service = new OAuthServerFactory()->make($providerName);
        $this->assertSame(config("oauth.providers.$providerName.client_id"), $query['client_id']);
        $this->assertSame('code', $query['response_type']);
        $this->assertSame(config('oauth.redirect') . "/" . $providerName, urldecode($query['redirect_uri']));
        $this->assertSame($service->getUriScope($action), $query['scope']);
        // $this->assertSame("select_account", $query['prompt']);
        $service->validateUriEncondedState($query['state']);
    }

    public function test_fortytwo_login_uri_generation()
    {
        $providerName = 'fortytwo';
        $action = 'login';

        $response = $this->get(config('oauth.uri_generation') . '?' . http_build_query([
            'provider' => $providerName,
            'action' => $action 
        ]),[
                'accept' => 'application/json'
        ])
        ->assertOk();

        $uri = $response->json('uri');
        parse_str(parse_url($uri, PHP_URL_QUERY), $query);

        $service = new OAuthServerFactory()->make($providerName);
        $this->assertSame(config("oauth.providers.$providerName.client_id"), $query['client_id']);
        $this->assertSame('code', $query['response_type']);
        $this->assertSame(config('oauth.redirect'). "/" . $providerName , urldecode($query['redirect_uri']));
        $this->assertSame($service->getUriScope($action), $query['scope']);
        $service->validateUriEncondedState($query['state']);
    }
}
