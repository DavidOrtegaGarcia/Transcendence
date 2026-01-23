<?php

namespace Tests\Feature;

use App\Models\OAuthExchange;
use App\OAuth\Factories\OAuthServerFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
 

/**
 * 
 * OUTDATED DOCS.
 * 
 * This test happens after the user gets redirected and the SPA makes a POST request
 * to the backend with the data provided by the OAuth server.
 * 
 * A goal is to test many scenarios and bussines rules related to the creation of accounts.
 * 
 * Another goal is to test failure paths on the process.
 * 
 * The tests are repeatead for each provider with the intent of test the specific
 * behaviour of each.
 * 
 * All tests follow the steps.
 * 
 * 1. An SPA makes a POST request to the backend with the data specific to each provider for a login.
 * 2. Blackbox behaviour A: The backend sends a request to the provider to get an exchange token. Must fake the response.
 * 3. Blackbox behaviour B: The backend sends a request to the provider to retrieve the user identity. Must fake the response.
 * 4. Bussiness rule applies. (Test unit dependant). E.g: A new user is created.
 * 
 * Consideration: The controller should validate the state, it should be created on the previous step. Here, it's created manually.
 * 
 * For (1), Google might return 'error' and 'state'
 * For (1), Google might return 'state' 'code' 'scope' 'prompt' 'authuser'
 * 
 * For (1), Fortytwo might return 'error_description', 'error' and 'state'
 * For (1), Fortytwo might return 'code' and 'state' 
 * 
 * Based on that: 
 * Always verify state
 * Verify prompt=consent in google
 * Verify scope in google
 * Don't display error because it's unlocalized, just understand error in query means no
 * 'code' works both ways the same
 */


class OAuthLoginTest extends TestCase
{
    use RefreshDatabase;

    public function fortytwo_test_new_user_is_created_and_logged()
    {
        $exchange = OAuthExchange::create([
            'provider' => 'fortytwo',
            'scope' => config('oauth.providers.fortytwo.actions.login.scope'),
            'access_token' => 'access',
            'expires_at' => now()->addYear(),
            'refresh_token' => 'refresh',
            ''
        ]);
        $exchange->update([

        ]);
    }

    public function fortytwo_test_new_user_is_logged()
    {
        
    }
}
