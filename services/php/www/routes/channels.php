<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('reverb-ping-public', function () {
    // true;
}, ['guards' => ['sanctum']]);

Broadcast::channel('reverb-ping-private', function ($user) {
    return true;
}, ['guards' => ['sanctum']]);

Broadcast::channel('reverb-ping-presence', function ($user) {
    return ['user-id' => $user?->id];
}, ['guards' => ['sanctum']]);
