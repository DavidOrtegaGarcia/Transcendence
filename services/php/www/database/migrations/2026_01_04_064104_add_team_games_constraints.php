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
            $table->foreignId('team_a_id')->nullable()->constrained('teams')->cascadeOnDelete();
            $table->foreignId('team_b_id')->nullable()->constrained('teams')->cascadeOnDelete();
            $table->foreignId('team_next_id')->nullable()->constrained('teams')->cascadeOnDelete();
            $table->foreignId('team_winner_id')->nullable()->constrained('teams')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {


        Schema::table('games', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_a_id');
            $table->dropConstrainedForeignId('team_b_id');
            $table->dropConstrainedForeignId('team_next_id');
            $table->dropConstrainedForeignId('team_winner_id');
        });
    }
};
