<?php

use App\Enums\GameMode;

return [
    'costs' => [
        GameMode::CAMPAIGN_1->value = null,
        GameMode::CAMPAIGN_2->value = null,
        GameMode::CAMPAIGN_3->value = null,
        GameMode::PVE->value => null,
        GameMode::PVP_CASUAL_UNLIMITED->value => null,
        GameMode::PVP_CASUAL_LIMITED->value => 4,
        GameMode::PVP_RANKED->value => 4, 
    ],

    'sum_rule' => [
        GameMode::CAMPAIGN_1->value = false,
        GameMode::CAMPAIGN_2->value = true,
        GameMode::CAMPAIGN_3->value = true,
        GameMode::PVE->value => true,
        GameMode::PVP_CASUAL_UNLIMITED->value => true,
        GameMode::PVP_CASUAL_LIMITED->value => true,
        GameMode::PVP_RANKED->value => true, 
    ],

    'equal_rule' => [
        GameMode::CAMPAIGN_1->value = false,
        GameMode::CAMPAIGN_2->value = true,
        GameMode::CAMPAIGN_3->value = true,
        GameMode::PVE->value => true,
        GameMode::PVP_CASUAL_UNLIMITED->value => true,
        GameMode::PVP_CASUAL_LIMITED->value => true,
        GameMode::PVP_RANKED->value => true, 
    ],

    'skills_rule' => [
        GameMode::CAMPAIGN_1->value = false,
        GameMode::CAMPAIGN_2->value = false,
        GameMode::CAMPAIGN_3->value = true,
        GameMode::PVE->value => true,
        GameMode::PVP_CASUAL_UNLIMITED->value => true,
        GameMode::PVP_CASUAL_LIMITED->value => true,
        GameMode::PVP_RANKED->value => true, 
    ],

    'default_hand_size' => 5,
    'default_board_size' => 3,
    'default_turn_timeout' => 30,
];