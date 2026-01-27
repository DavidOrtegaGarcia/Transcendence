<?php

namespace Tests\Feature;

use App\Enums\ChatVisibility;
use App\Enums\FriendshipStatus;
use App\Enums\GameMode;
use App\Models\Chat;
use App\Models\Friendship;
use App\Models\Game;
use App\Models\Message;
use App\Services\FriendshipService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;
use function PHPUnit\Framework\assertTrue;

/**

 * For now, the frontend sends a gamemode and that's what it goes. But it's pending to validate the gamemode according to undefined business rules.
 */

class GameCreationTest extends TestCase
{
    use RefreshDatabase;

    public static function validationErrors(): array
    {
        return [
            'missing gamemode' => [[], 'mode'],
            'Rare gamemode' => [['mode' => 'PvP'], 'mode'],
        ];
    }

    public static function gamemodeConfigs(): array
    {
        return collect(GameMode::cases())->mapWithKeys(fn($mode) => [
            $mode->value => [$mode]
        ])->toArray();
    }

    /**
     * This test makes sure games get created with the correct parameters for each gamemode.
     */
    #[DataProvider('gamemodeConfigs')]
    public function test_create_game_with_correct_parameters(GameMode $gamemode)
    {
        $config = [
            'max_cost' => config('gamemodes.costs')[$gamemode->value],
            'sum_rule' => config('gamemodes.sum_rule')[$gamemode->value],
            'equal_rule' => config('gamemodes.equal_rule')[$gamemode->value],
            'skills_rule' => config('gamemodes.skills_rule')[$gamemode->value],
            'hand_size' => config('gamemodes.default_hand_size'),
            'board_size' => config('gamemodes.default_board_size'),
            'turn_time_limit' => config('gamemodes.default_turn_timeout'),
        ];

        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson("/v1/games", [
            'mode' => $gamemode->value
        ])->assertCreated();

        $response->assertJsonStructure([
            'config' => [
                'max_cost',
                'sum_rule',
                'equal_rule',
                'skills_rule',
                'hand_size',
            ],
        ]);
        assertEquals($config, $response->json()['config']);
    }

    public function test_game_returns_match_id()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson("/v1/games", [
            'mode' => GameMode::CAMPAIGN_1->value,
        ])->assertCreated();

        $response->assertJsonStructure([
            'match_id'
        ]);

        $game = Game::findOrFail(1);

        assertEquals($game->id, $response->json()['match_id']);
    }

    // Test validation errors that can be handled at the controller validator level
    #[DataProvider('validationErrors')]
    public function test_validation_errors($payload, $errorKey)
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $this->postJson("/v1/games", $payload)->assertUnprocessable()->assertJsonValidationErrors($errorKey);
    }
    // public function test_create_1v1_game()
    // {
    //     $players = User::factory()->createMany(2);

    //     $this->actingAs($players[0]);

    //     $this->postJson("/v1/games", 
    //     [
    //         'mode' => GameMode::ONEVONE->value,
    //         'teams' => 
    //         [
    //             [
    //                 'order' => 1,
    //                 'players' => 
    //                 [
    //                     [
    //                         'order' => 1,
    //                         'user_id' => $players[0]->id
    //                     ]
    //                 ]
    //             ], 
    //             [
    //                 'order' => 2,
    //                 'players' => 
    //                 [   
    //                     [
    //                         'order' => 1,
    //                         'user_id' => $players[1]->id
    //                     ]
    //                 ]
    //             ]
    //         ],
    //     ]
    //     )->assertCreated();

    //     $game = Game::first();

    //     // Game
    //     assertSame($game->game_mode, GameMode::ONEVONE);

    //     // Sizes
    //     assertSame($game->teams->count(), 2);
    //     assertSame($game->teams[0]->teamMembers->count(), 1);
    //     assertSame($game->teams[1]->teamMembers->count(), 1);

    //     // Orders
    //     assertSame($game->teams[0]->order, 1);
    //     assertSame($game->teams[1]->order, 2);
    //     assertSame($game->teams[0]->teamMembers[0]->order, 1);
    //     assertSame($game->teams[1]->teamMembers[0]->order, 1);

    //     // Ids
    //     assertSame($game->teams[0]->teamMembers[0]->user_id, $players[0]->id);
    //     assertSame($game->teams[1]->teamMembers[0]->user_id, $players[1]->id);
    //     assertSame($game->teams[0]->game_id, $game->id);
    //     assertSame($game->teams[1]->game_id, $game->id);
    //     assertSame($game->teams[0]->teamMembers[0]->team_id, $game->teams[0]->id);
    //     assertSame($game->teams[1]->teamMembers[0]->team_id, $game->teams[1]->id);
    // }

    // public function test_create_1v1_game_with_one_ai()
    // {
    //     $players = User::factory()->createMany(1);

    //     $this->actingAs($players[0]);

    //     $this->postJson("/v1/games", [
    //         'mode' => GameMode::ONEVONE->value,
    //         'teams' => 
    //         [
    //             [
    //                 'order' => 1,
    //                 'players' => 
    //                 [
    //                     [
    //                         'order' => 1,
    //                         'user_id' => $players[0]->id
    //                     ],
    //                 ]
    //             ], 
    //             [
    //                 'order' => 2,
    //                 'players' => 
    //                 [   
    //                     [
    //                         'order' => 1,
    //                         'user_id' => null
    //                     ],
    //                 ]
    //             ]
    //         ],
    //     ])->assertCreated();

    //     $game = Game::first();

    //     // Ids
    //     assertSame($game->teams[0]->teamMembers[0]->user_id, $players[0]->id);
    //     assertSame($game->teams[1]->teamMembers[0]->user_id, null);
    //     assertSame($game->teams[0]->teamMembers[0]->team_id, $game->teams[0]->id);
    //     assertSame($game->teams[1]->teamMembers[0]->team_id, $game->teams[1]->id);
    // }

    // /**
    //  * @dataProvider invalidGamePayloads
    //  */
    // public function test_create_game_with_invalid_payload(array $payload, array $errors)
    // {
    //     $user = User::factory()->create();

    //     $this->actingAs($user);

    //     $this->postJson('/v1/games', $payload)
    //         ->assertUnprocessable()
    //         ->assertJsonValidationErrors($errors);
    // }


    // public function test_create_game_with_repeated_player()
    // {

    // }

    // public function test_create_game_without_order()
    // {

    // }

    // public function test_create_game_with_player_without_order()
    // {

    // }

    // public function test_create_game_with_no_int_order()
    // {

    // }

    // public function test_create_game_with_player_with_no_int_order()
    // {

    // }

    // public function test_create_game_with_repeated_order()
    // {

    // }

    // public function test_create_game_with_player_with_repeated_order()
    // {

    // }

    // public function test_create_game_with_no_scaling_order()
    // {

    // }

    // public function test_create_game_with_player_with_no_scaling_order()
    // {

    // }

    // public function test_only_auth_user_who_is_participating_can_create_games(){}

    // public static function invalidGamePayloads(): array
    // {
    //     return [
    //         'missing mode' => 
    //         [
    //             [
    //                 'teams' => 
    //                 [
    //                     [
    //                         'order' => 1,
    //                         'players' =>
    //                         [
    //                             ['order' => 1, 'user_id' => 1],
    //                         ],
    //                     ],
    //                     [
    //                         'order' => 2,
    //                         'players' =>
    //                         [
    //                             ['order' => 1, 'user_id' => null],
    //                         ],
    //                     ],
    //                 ],
    //             ],
    //         ],

    //         'missing teams' => 
    //         [
    //             [
    //                 'mode' => GameMode::ONEVONE->value,
    //             ],
    //         ],

    //         'teams without players' => 
    //         [
    //             [
    //                 'mode' => GameMode::ONEVONE->value,
    //                 'teams' => 
    //                 [
    //                     ['order' => 1],
    //                     ['order' => 2],
    //                 ],
    //             ],
    //         ],

    //         'rare_mode' => 
    //         [
    //             'mode' => "abce",
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         'empty_mode' => 
    //         [
    //             'mode' => "",
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         'rare_teams' => 
    //         [
    //             'mode' => "abce",
    //             'teams' => 
    //             [
    //                 "Team A",
    //                 "Team B"
    //             ],
    //         ],

    //         '1v1_too_many_teams' => 
    //         [
    //             'mode' => "abce",
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ],
    //                 [
    //                     'order' => 3,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 3
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '1v1_game_no_order' => 
    //         [
    //             'mode' => GameMode::ONEVONE->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '1v1_game_rare_order' => 
    //         [
    //             'mode' => GameMode::ONEVONE->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => "as",
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '1v1_game_order_0' => 
    //         [
    //             'mode' => GameMode::ONEVONE->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 0,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '1v1_game_order_3' => 
    //         [
    //             'mode' => GameMode::ONEVONE->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 3,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '1v1_game_repeated_order' => 
    //         [
    //             'mode' => GameMode::ONEVONE->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '1v1_player_no_order' => 
    //         [
    //             'mode' => GameMode::ONEVONE->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '1v1_player_rare_order' => 
    //         [
    //             'mode' => GameMode::ONEVONE->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => "",
    //                             'user_id' => 1
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '2v2_player_0_order' => 
    //         [
    //             'mode' => GameMode::TWOVTWO->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 3
    //                         ],
    //                         [
    //                             'order' => 0,
    //                             'user_id' => 4
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '2v2_player_3_order' => 
    //         [
    //             'mode' => GameMode::TWOVTWO->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 3
    //                         ],
    //                         [
    //                             'order' => 3,
    //                             'user_id' => 4
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '2v2_player_repeated_order' => 
    //         [
    //             'mode' => GameMode::TWOVTWO->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 3
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 4
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '2v2_player_unexisting_user' => 
    //         [
    //             'mode' => GameMode::TWOVTWO->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 3
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 999
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '2v2_player_rare_user' => 
    //         [
    //             'mode' => GameMode::TWOVTWO->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 3
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => "a"
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '2v2_player_lacking_user' => 
    //         [
    //             'mode' => GameMode::TWOVTWO->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ],
    //                         [
    //                             'order' => 2,
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 3
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 4
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ],

    //         '2v2_player_lacking_user_2' => 
    //         [
    //             'mode' => GameMode::TWOVTWO->value,
    //             'teams' => 
    //             [
    //                 [
    //                     'order' => 1,
    //                     'players' => 
    //                     [
    //                         [
    //                             'order' => 1,
    //                             'user_id' => 1
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 2
    //                         ]
    //                     ]
    //                 ], 
    //                 [
    //                     'order' => 2,
    //                     'players' => 
    //                     [   
    //                         [
    //                             'order' => 1,
    //                         ],
    //                         [
    //                             'order' => 2,
    //                             'user_id' => 4
    //                         ]
    //                     ]
    //                 ]
    //             ],
    //         ]


















    //     ];
    // }
}
