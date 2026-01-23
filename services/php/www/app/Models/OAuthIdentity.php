<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OAuthIdentity extends Model
{
    protected $table = "oauth_identity";

    protected $fillable = [
        'provider',
        'provider_id',
        'email',
        'user_id',
    ];
}