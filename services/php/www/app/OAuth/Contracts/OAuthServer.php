<?php

namespace App\OAuth\Contracts;

use App\Models\OAuthExchange;

interface OAuthServer 
{
    /**
     * Generates the scope for the user redirection based on the action to perform
     */
    public function getUriScope(string $action): string;

    /**
     * Retrieves an uri-ready state for the user redirection based on the action to perform
     */
    public function getUriEncodedState(string $action): string;

    /**
     * Generates an state for the provided action and saves it to session.
     * States consist of a JSON encoded provider, action and CSRF token.
     */
    public function generateState(string $action): void;

    /**
     * Validate the state received from a (App) client coincides with the session's state.
     */
    public function validateUriEncondedState(string $state): array;

    /**
     * Generates an URI to redirect the user to the OAuth server. Server-dependant.
     */
    public function generateUserRedirectUri(string $action): string;


    /**
     * Receives a valid state and executes the action
     */
    public function execute(string $action, string $access_token);

    /**
     * Takes a code, requests the JWT token and the rest of the data the server provides on exchane of the 'code'
     */
    public function exchangeCode($code, $state): OAuthExchange;
}