<?php

namespace App\Services;

use App\Enums\ChatVisibility;
use App\Enums\GameMode;
use App\Exceptions\SocialException;
use App\Models\Chat;
use App\Models\Game;
use App\Models\Message;
use App\Models\Team;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class GameService
{
    private function getGameParameters(GameMode $gamemode)
    {
        return [
            'max_cost' => config('gamemodes.costs')[$gamemode->value],
            'sum_rule' => config('gamemodes.sum_rule')[$gamemode->value],
            'equal_rule' => config('gamemodes.equal_rule')[$gamemode->value],
            'skills_rule' => config('gamemodes.skills_rule')[$gamemode->value],
            'hand_size' => config('gamemodes.default_hand_size'),
            'board_size' => config('gamemodes.default_board_size'),
            'turn_time_limit' => config('gamemodes.default_turn_timeout'),
        ];
    }

    public function createGame(GameMode $gamemode): Game
    {
        return Game::create([
                'type' => $gamemode,
                'parameters' => $this->getGameParameters($gamemode),
                'board_state' => [],
            ]
        );
    }
}