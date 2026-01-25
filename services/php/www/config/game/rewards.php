<?php

use App\Enums\GameMode;

return [
    'cards' => [
        'account_creation' => [1, 2, 3, 4, 5],
        'level' => [
            '1' => [6, 7],
            '2' => [8, 9],
            '3' => [10, 11],
            '4' => [12],
            '5' => [15]
        ]
    ],

    'experience_win' => [
        GameMode::CAMPAIGN_1->value => 50,
        GameMode::CAMPAIGN_2->value => 100,
        GameMode::CAMPAIGN_3->value => 150,
        GameMode::PVE->value => 150,
        GameMode::PVP_CASUAL_UNLIMITED => 175,
        GameMode::PVP_CASUAL_LIMITED => 300,
        GameMode::PVP_RANKED => 500,
    ],

    'experience_loss' => [
        GameMode::CAMPAIGN_1->value => 0,
        GameMode::CAMPAIGN_2->value => 0,
        GameMode::CAMPAIGN_3->value => 0,
        GameMode::PVE->value => 70,
        GameMode::PVP_CASUAL_UNLIMITED => 80,
        GameMode::PVP_CASUAL_LIMITED => 90,
        GameMode::PVP_RANKED => 100,
    ],
];