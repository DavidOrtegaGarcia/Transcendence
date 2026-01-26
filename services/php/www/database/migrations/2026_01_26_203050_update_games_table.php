<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['game_mode', 'board']);
            $table->enum('type', [
                'CAMPAIGN_1',
                'CAMPAIGN_2',
                'CAMPAIGN_3',
                'PVE',
                'PVP_CASUAL_LIMITED',
                'PVP_CASUAL_UNLIMITED',
                'PVP_RANKED'
            ]);
            $table->json('board_state');
            $table->json('parameters');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn(['type', 'board_state', 'parameters']);
            $table->enum('game_mode', ['1V1', '2V2'])->after('id');
            $table->json('board')->after('game_mode');
        });
    }
};