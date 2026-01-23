<?php

return [
    'providers' => [
        'fortytwo' => [
            'server' => App\OAuth\Servers\FortytwoServer::class,
            'state_expiration_time' => 300,
            'authorize' => 'https://api.intra.42.fr/oauth/authorize',
            'token_exchange_endpoint' => 'https://api.intra.42.fr/oauth/token',
            'client_id' => env('OAUTH_FORTYTWO_CLIENT_ID'),
            'client_secret' =>  env('OAUTH_FORTYTWO_CLIENT_SECRET'),
            'actions' => [
                'login' => [
                    'scope' => 'public',
                ],
                'link' => [
                    'scope' => 'public',
                ]
            ],
            'endpoints' => [
                'user_data' => 'https://api.intra.42.fr/v2/me'
            ]
        ],
        'google' => [
            'server' => App\OAuth\Servers\GoogleServer::class,
            'state_expiration_time' => 300,
            'authorize' => 'https://accounts.google.com/o/oauth2/v2/auth',
            'token_exchange_endpoint' => 'https://oauth2.googleapis.com/token',
            'client_id' => env('OAUTH_GOOGLE_CLIENT_ID'),
            'client_secret' =>  env('OAUTH_GOOGLE_CLIENT_SECRET'),
            'actions' => [
                'login' => [
                    'scope' => 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
                ],
                'link' => [
                    'scope' => 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
                ]
            ],
            'endpoints' => [
                'user_data' => 'https://openidconnect.googleapis.com/v1/userinfo',
                'discovery' => 'https://accounts.google.com/.well-known/openid-configuration',
            ]
        ],
    ],

    // Path for the SPA to retrieve an URI. This URI is where the user should be sent at first.
    'uri_generation' => '/oauth-uri',

    // Path for the server redirection. Loads a loading page and sends a POST request to the backend.
    'redirect' => 'http://localhost:5173/oauth-redirect',

    // Path for the SPA to send a POST request with the server's data.
    'redirected' => '/oauth-redirected'
];