<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('oauth_exchanges', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
    
            $table->string('provider');
            $table->string('scope')->nullable();
            $table->string('authorization_code')->unique();
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->text('extra')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('oauth_exchanges');
    }
};

