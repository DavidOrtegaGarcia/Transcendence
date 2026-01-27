<?php

namespace App\Enums;

enum GameMode: string
{
    case CAMPAIGN_1 = "CAMPAIGN_1";
    case CAMPAIGN_2 = "CAMPAIGN_2";
    case CAMPAIGN_3 = "CAMPAIGN_3";
    case PVE = "PVE";
    CASE PVP_CASUAL_LIMITED = "PVP_CASUAL_LIMITED";
    CASE PVP_CASUAL_UNLIMITED = "PVP_CASUAL_UNLIMITED";
    CASE PVP_RANKED = "PVP_RANKED";
}