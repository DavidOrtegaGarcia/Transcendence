<?php

use App\Enums\CardRarity;

return [
    'costs' => [
        CardRarity::COMMON->value => 0,
        CardRarity::RARE->value => 1,
        CardRarity::EPIC->value => 2,
        CardRarity::GOLDEN->value => 3,
    ],
];