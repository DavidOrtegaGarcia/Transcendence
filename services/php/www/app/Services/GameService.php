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
    public function parseTeams(array $data, &$team_a, &$team_b)
    {
        if ($data[0]['order'] == 1)
        {
            $team_a = $data[0];
            $team_b = $data[1];
        }
        else 
        {
            $team_a = $data[1];
            $team_b = $data[0];
        }
    }

    public function parseOnevoneMembers(array $team, &$user_a)
    {
        $user_a = $team['players'][0]['user_id'];
    }

    public function parseTwovtwoMembers(array $team, &$user_a, &$user_b)
    {
        if ($team['players'][0]['order'] == 1)
        {
            $user_a = $team['players'][0]['user_id'];
            $user_b = $team['players'][1]['user_id'];
        }
        else 
        {
            $user_b = $team['players'][0]['user_id'];
            $user_a = $team['players'][1]['user_id'];
        }
    }

    public function createtwovtwogame(int|null $user_aa_id, int|null $user_ab_id, int|null $user_ba_id, int|null $user_bb_id): Game
    {
        $user_aa = $user_aa_id ? User::findOrFail($user_aa_id) : null;
        $user_ba = $user_ba_id ? User::findOrFail($user_ba_id) : null;
        $user_ab = $user_ab_id ? User::findOrFail($user_ab_id) : null;
        $user_bb = $user_bb_id ? User::findOrFail($user_bb_id) : null;

        return DB::transaction(function () use ($user_aa, $user_ba, $user_ab, $user_bb) {
            $game = Game::create([
                'game_mode' => GameMode::TWOVTWO,
                'board' => []
            ]);

            $team_a = Team::create([
                'order' => 1,
                'game_id' => $game->id,
            ]);

            $team_b = Team::create([
                'order' => 2,
                'game_id' => $game->id,
            ]);

            $team_member_aa = TeamMember::create([
                'team_id' => $team_a->id,
                'order' => 1,
                'user_id' => $user_aa->id ?? null,
            ]);

            $team_member_ba = TeamMember::create([
                'team_id' => $team_b->id,
                'order' => 1,
                'user_id' => $user_ba->id ?? null,
            ]);

            $team_member_ab = TeamMember::create([
                'team_id' => $team_a->id,
                'order' => 2,
                'user_id' => $user_ab->id ?? null,
            ]);

            $team_member_bb = TeamMember::create([
                'team_id' => $team_b->id,
                'order' => 2,
                'user_id' => $user_bb->id ?? null,
            ]);

            $game->update([
                'team_a_id' => $team_a->id,
                'team_b_id'=> $team_b->id,
                'team_next_id' => $team_a->id,
            ]);
            
            $game->save();

            $team_a->update([
                'player_next_id' => $team_member_aa->id
            ]);

            $team_a->save();

            $team_b->update([
                'player_next_id' => $team_member_ba->id
            ]);

            $team_b->save();

            return $game;
        });
    }

    public function createOnevoneGame(int|null $user_aa_id, int|null $user_ba_id): Game
    {
        $user_aa = $user_aa_id ? User::findOrFail($user_aa_id) : null;
        $user_ba = $user_ba_id ? User::findOrFail($user_ba_id) : null;

        return DB::transaction(function () use ($user_aa, $user_ba) {
            $game = Game::create([
                'game_mode' => GameMode::ONEVONE,
                'board' => []
            ]);

            $team_a = Team::create([
                'order' => 1,
                'game_id' => $game->id,
            ]);

            $team_b = Team::create([
                'order' => 2,
                'game_id' => $game->id,
            ]);

            $team_member_a = TeamMember::create([
                'team_id' => $team_a->id,
                'order' => 1,
                'user_id' => $user_aa->id ?? null,
            ]);

            $team_member_b = TeamMember::create([
                'team_id' => $team_b->id,
                'order' => 1,
                'user_id' => $user_ba->id ?? null,
            ]);

            $game->update([
                'team_a_id' => $team_a->id,
                'team_b_id'=> $team_b->id,
                'team_next_id' => $team_a->id,
            ]);
            
            $game->save();

            $team_a->update([
                'player_next_id' => $team_member_a->id
            ]);

            $team_a->save();

            $team_b->update([
                'player_next_id' => $team_member_b->id
            ]);

            $team_b->save();

            return $game;
        });
    }
}