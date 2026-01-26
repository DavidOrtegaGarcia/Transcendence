<?php

namespace App\Http\Controllers;

use App\Enums\GameMode;
use App\Models\Chat;
use App\Services\ChatService;
use App\Services\GameService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

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
        $request->validate([
            'mode' => ['required', Rule::enum(GameMode::class)],
        ]);

        $gamemode = GameMode::from($request->input('mode'));

        $game = $service->createGame($gamemode);

        return response()->json($game->toResource(), 201);
    }

}