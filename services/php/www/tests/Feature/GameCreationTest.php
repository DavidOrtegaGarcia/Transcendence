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
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;
use function PHPUnit\Framework\assertTrue;

/**
 * 
 * Api needs
    {
        mode: ["1V1", "2V2"],
        teams: [
            {
                "order": 1
                "players": [
                    {
                        "order": 1
                        "user_id": 4
                    },
                    {
                        "order": 2
                        "user_id": null
                    }
                ]
            },
            {
                "order": 2,
                "players": [
                    {
                        "order": 1
                        "user_id": 8
                    },
                    {
                        "order": 2
                        "user_id": null
                    }
                ]
            }
        ]
    }
 */

class GameCreationTest extends TestCase
{
    use RefreshDatabase;

    // "/v1/games
    public function test_create_1v1_game()
    {
        $players = User::factory()->createMany(2);

        $this->actingAs($players[0]);

        $this->postJson("/v1/games", 
        [
            'mode' => GameMode::ONEVONE->value,
            'teams' => 
            [
                [
                    'order' => 1,
                    'players' => 
                    [
                        [
                            'order' => 1,
                            'user_id' => $players[0]->id
                        ]
                    ]
                ], 
                [
                    'order' => 2,
                    'players' => 
                    [   
                        [
                            'order' => 1,
                            'user_id' => $players[1]->id
                        ]
                    ]
                ]
            ],
        ]
        )->assertCreated();

        $game = Game::first();

        // Game
        assertSame($game->game_mode, GameMode::ONEVONE);

        // Sizes
        assertSame($game->teams->count(), 2);
        assertSame($game->teams[0]->teamMembers->count(), 1);
        assertSame($game->teams[1]->teamMembers->count(), 1);

        // Orders
        assertSame($game->teams[0]->order, 1);
        assertSame($game->teams[1]->order, 2);
        assertSame($game->teams[0]->teamMembers[0]->order, 1);
        assertSame($game->teams[1]->teamMembers[0]->order, 1);

        // Ids
        assertSame($game->teams[0]->teamMembers[0]->user_id, $players[0]->id);
        assertSame($game->teams[1]->teamMembers[0]->user_id, $players[1]->id);
        assertSame($game->teams[0]->game_id, $game->id);
        assertSame($game->teams[1]->game_id, $game->id);
        assertSame($game->teams[0]->teamMembers[0]->team_id, $game->teams[0]->id);
        assertSame($game->teams[1]->teamMembers[0]->team_id, $game->teams[1]->id);
    }

    public function test_create_2v2_game()
    {
        $players = User::factory()->createMany(4);

        $this->actingAs($players[0]);

        $this->postJson("/v1/games", 
        [
            'mode' => GameMode::TWOVTWO->value,
            'teams' => 
            [
                [
                    'order' => 1,
                    'players' => 
                    [
                        [
                            'order' => 1,
                            'user_id' => $players[0]->id
                        ],
                        [
                            'order' => 2,
                            'user_id' => $players[1]->id
                        ]
                    ]
                ], 
                [
                    'order' => 2,
                    'players' => 
                    [   
                        [
                            'order' => 1,
                            'user_id' => $players[2]->id
                        ],
                        [
                            'order' => 2,
                            'user_id' => $players[3]->id
                        ]
                    ]
                ]
            ],
        ]
        )->assertCreated();

        $game = Game::first();

        // dd($game, $game->teams, $game->teams[0]->teamMembers);
        // Game
        assertSame($game->game_mode, GameMode::TWOVTWO);

        // Sizes
        assertSame($game->teams->count(), 2);
        assertSame($game->teams[0]->teamMembers->count(), 2);
        assertSame($game->teams[1]->teamMembers->count(), 2);

        // Orders
        assertSame($game->teams[0]->order, 1);
        assertSame($game->teams[1]->order, 2);
        assertSame($game->teams[0]->teamMembers[0]->order, 1);
        assertSame($game->teams[1]->teamMembers[0]->order, 1);
        assertSame($game->teams[0]->teamMembers[1]->order, 2);
        assertSame($game->teams[1]->teamMembers[1]->order, 2);

        // Ids
        assertSame($game->teams[0]->teamMembers[0]->user_id, $players[0]->id);
        assertSame($game->teams[0]->teamMembers[1]->user_id, $players[1]->id);
        assertSame($game->teams[1]->teamMembers[0]->user_id, $players[2]->id);
        assertSame($game->teams[1]->teamMembers[1]->user_id, $players[3]->id);
        assertSame($game->teams[0]->game_id, $game->id);
        assertSame($game->teams[1]->game_id, $game->id);
        assertSame($game->teams[0]->teamMembers[0]->team_id, $game->teams[0]->id);
        assertSame($game->teams[0]->teamMembers[1]->team_id, $game->teams[0]->id);
        assertSame($game->teams[1]->teamMembers[0]->team_id, $game->teams[1]->id);
        assertSame($game->teams[1]->teamMembers[1]->team_id, $game->teams[1]->id);
    }

    public function test_create_1v1_game_with_one_ai()
    {
        $players = User::factory()->createMany(1);

        $this->actingAs($players[0]);

        $this->postJson("/v1/games", [
            'mode' => GameMode::ONEVONE->value,
            'teams' => 
            [
                [
                    'order' => 1,
                    'players' => 
                    [
                        [
                            'order' => 1,
                            'user_id' => $players[0]->id
                        ],
                    ]
                ], 
                [
                    'order' => 2,
                    'players' => 
                    [   
                        [
                            'order' => 1,
                            'user_id' => null
                        ],
                    ]
                ]
            ],
        ])->assertCreated();

        $game = Game::first();

        // Ids
        assertSame($game->teams[0]->teamMembers[0]->user_id, $players[0]->id);
        assertSame($game->teams[1]->teamMembers[0]->user_id, null);
        assertSame($game->teams[0]->teamMembers[0]->team_id, $game->teams[0]->id);
        assertSame($game->teams[1]->teamMembers[0]->team_id, $game->teams[1]->id);
    }

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

    public static function invalidGamePayloads(): array
    {
        return [
            'missing mode' => 
            [
                [
                    'teams' => 
                    [
                        [
                            'order' => 1,
                            'players' =>
                            [
                                ['order' => 1, 'user_id' => 1],
                            ],
                        ],
                        [
                            'order' => 2,
                            'players' =>
                            [
                                ['order' => 1, 'user_id' => null],
                            ],
                        ],
                    ],
                ],
            ],

            'missing teams' => 
            [
                [
                    'mode' => GameMode::ONEVONE->value,
                ],
            ],

            'teams without players' => 
            [
                [
                    'mode' => GameMode::ONEVONE->value,
                    'teams' => 
                    [
                        ['order' => 1],
                        ['order' => 2],
                    ],
                ],
            ],

            'rare_mode' => 
            [
                'mode' => "abce",
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            'empty_mode' => 
            [
                'mode' => "",
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            'rare_teams' => 
            [
                'mode' => "abce",
                'teams' => 
                [
                    "Team A",
                    "Team B"
                ],
            ],

            '1v1_too_many_teams' => 
            [
                'mode' => "abce",
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ],
                    [
                        'order' => 3,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 3
                            ]
                        ]
                    ]
                ],
            ],

            '1v1_game_no_order' => 
            [
                'mode' => GameMode::ONEVONE->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            '1v1_game_rare_order' => 
            [
                'mode' => GameMode::ONEVONE->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => "as",
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            '1v1_game_order_0' => 
            [
                'mode' => GameMode::ONEVONE->value,
                'teams' => 
                [
                    [
                        'order' => 0,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            '1v1_game_order_3' => 
            [
                'mode' => GameMode::ONEVONE->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 3,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            '1v1_game_repeated_order' => 
            [
                'mode' => GameMode::ONEVONE->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 1,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            '1v1_player_no_order' => 
            [
                'mode' => GameMode::ONEVONE->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            '1v1_player_rare_order' => 
            [
                'mode' => GameMode::ONEVONE->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => "",
                                'user_id' => 1
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 2
                            ]
                        ]
                    ]
                ],
            ],

            '2v2_player_0_order' => 
            [
                'mode' => GameMode::TWOVTWO->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ],
                            [
                                'order' => 2,
                                'user_id' => 2
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 3
                            ],
                            [
                                'order' => 0,
                                'user_id' => 4
                            ]
                        ]
                    ]
                ],
            ],

            '2v2_player_3_order' => 
            [
                'mode' => GameMode::TWOVTWO->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ],
                            [
                                'order' => 2,
                                'user_id' => 2
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 3
                            ],
                            [
                                'order' => 3,
                                'user_id' => 4
                            ]
                        ]
                    ]
                ],
            ],

            '2v2_player_repeated_order' => 
            [
                'mode' => GameMode::TWOVTWO->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ],
                            [
                                'order' => 2,
                                'user_id' => 2
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 2,
                                'user_id' => 3
                            ],
                            [
                                'order' => 2,
                                'user_id' => 4
                            ]
                        ]
                    ]
                ],
            ],

            '2v2_player_unexisting_user' => 
            [
                'mode' => GameMode::TWOVTWO->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ],
                            [
                                'order' => 2,
                                'user_id' => 2
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 3
                            ],
                            [
                                'order' => 2,
                                'user_id' => 999
                            ]
                        ]
                    ]
                ],
            ],

            '2v2_player_rare_user' => 
            [
                'mode' => GameMode::TWOVTWO->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ],
                            [
                                'order' => 2,
                                'user_id' => 2
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 3
                            ],
                            [
                                'order' => 2,
                                'user_id' => "a"
                            ]
                        ]
                    ]
                ],
            ],

            '2v2_player_lacking_user' => 
            [
                'mode' => GameMode::TWOVTWO->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ],
                            [
                                'order' => 2,
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                                'user_id' => 3
                            ],
                            [
                                'order' => 2,
                                'user_id' => 4
                            ]
                        ]
                    ]
                ],
            ],

            '2v2_player_lacking_user_2' => 
            [
                'mode' => GameMode::TWOVTWO->value,
                'teams' => 
                [
                    [
                        'order' => 1,
                        'players' => 
                        [
                            [
                                'order' => 1,
                                'user_id' => 1
                            ],
                            [
                                'order' => 2,
                                'user_id' => 2
                            ]
                        ]
                    ], 
                    [
                        'order' => 2,
                        'players' => 
                        [   
                            [
                                'order' => 1,
                            ],
                            [
                                'order' => 2,
                                'user_id' => 4
                            ]
                        ]
                    ]
                ],
            ]


















        ];
    }
}
