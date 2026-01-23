<?php

namespace App\Http\Controllers;

use App\Enums\GameMode;
use App\Models\Chat;
use App\Services\ChatService;
use App\Services\GameService;
use Illuminate\Http\Request;

    // {
    //     mode: ["1V1", "2V2"],
    //     teams: [
    //         {
    //             "order": 1
    //             "players": [
    //                 {
    //                     "order": 1
    //                     "user_id": 4
    //                 },
    //                 {
    //                     "order": 2
    //                     "user_id": null
    //                 }
    //             ]
    //         },
    //         {
    //             "order": 2,
    //             "players": [
    //                 {
    //                     "order": 1
    //                     "user_id": 8
    //                 },
    //                 {
    //                     "order": 2
    //                     "user_id": null
    //                 }
    //             ]
    //         }
    //     ]
    // }

class GameController 
{
    public function createGame(Request $request, GameService $service)
    {
        // $request->validate([
        //     ''
        // ]);
        
        $game = null;
        $team_a = null;
        $team_b = null;
        $user_aa = null;
        $user_bb = null;
        $user_ba = null;
        $user_ab = null;
        $service->parseTeams($request->input('teams'), $team_a, $team_b);
        
        switch($request->enum('mode', GameMode::class))
        {
            case GameMode::ONEVONE: 
                $service->parseOnevoneMembers($team_a, $user_aa); 
                $service->parseOnevoneMembers($team_b, $user_ba); 
                break ;
            case GameMode::TWOVTWO: 
                $service->parseTwovtwoMembers($team_a, $user_aa, $user_ab); 
                $service->parseTwovtwoMembers($team_b, $user_ba, $user_bb); 
                break ;
        }

        switch($request->enum('mode', GameMode::class))
        {
            case GameMode::ONEVONE: $game = $service->createOnevoneGame($user_aa, $user_ba); break ;
            case GameMode::TWOVTWO: $game = $service->createTwovtwogame($user_aa, $user_ab, $user_ba, $user_bb); break ;
        }

        return response()->json($game->toResource(), 201);
    }

}