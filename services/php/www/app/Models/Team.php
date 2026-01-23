<?php

namespace App\Models;

use App\Enums\GameMode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Team extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'order',
        'game_id',
        'player_next_id',
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [];
    }


    public function teamMembers(): HasMany
    {
        return $this->hasMany(TeamMember::class, 'team_id')->orderBy('order');
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
