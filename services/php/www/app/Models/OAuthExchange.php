<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OAuthExchange extends Model
{
    protected $table = "oauth_exchanges";

    protected $fillable = [
        'provider',
        'scope',
        'access_token',
        'refresh_token',
        'expires_at',
        'extra',
        'authorization_code'
    ];
    
    protected $hidden = [
        'access_token',
        'refresh_token',
    ];

    protected function casts(): array
    {
        return [
            'access_token' => 'encrypted',
            'refresh_token' => 'encrypted',
            'expires_at'    => 'datetime',
            'extra' => 'encrypted:array'
        ];
    }
}