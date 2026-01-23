<?php

use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        Schema::table('user_chat', function (Blueprint $table) {
            $table->foreignId('last_message_seen_id')->nullable()->constrained('messages')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_chat', function (Blueprint $table) {
            $table->dropForeign(['last_message_seen_id']);
            $table->dropColumn('last_message_seen_id');
        });
    }
};
