<?php

namespace App\Enums;

enum CardRarity: string
{
    case COMMON = "COMMON";
    case RARE = "RARE";
    case EPIC = "EPIC";
    case GOLDEN = "GOLDEN";
}