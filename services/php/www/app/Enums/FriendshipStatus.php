<?php

namespace App\Enums;

enum FriendshipStatus: string
{
    case PENDING = "pending";
    case ACCEPTED = "accepted";
    case REJECTED = "rejected";
}