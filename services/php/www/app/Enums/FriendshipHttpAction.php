<?php

namespace App\Enums;

enum FriendshipHttpAction: string
{
    case ACCEPT = "accept";
    case REJECT = "reject";
}