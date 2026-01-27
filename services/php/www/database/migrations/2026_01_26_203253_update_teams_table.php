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
        Schema::table('teams', function (Blueprint $table) {
            $table->enum('result', ['WINNER', 'LOSER', 'DRAW', 'PENDING'])
                  ->default('PENDING');
            $table->unique(['game_id', 'order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            // Drop unique indexes first using the Laravel naming convention
            $table->dropUnique(['team_id', 'game_id']);
            $table->dropUnique(['game_id', 'order']);

            // Drop the columns
            $table->dropColumn(['result']);
        });
    }
};