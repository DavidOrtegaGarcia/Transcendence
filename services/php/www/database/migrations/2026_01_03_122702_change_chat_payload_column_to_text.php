<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->renameColumn('payload', 'text');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->text('text')->change();
        });
    }

    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->renameColumn('text', 'payload');
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->json('payload')->change();
        });
    }
};
