<?php

namespace App\Models;

use App\Enums\GameMode;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Game extends Model
{
    use HasFactory;

    protected $table = "games";
    
    protected $fillable = [
        'game_mode',
        'board',
        'team_a_id',
        'team_b_id',
        'team_next_id',
        'team_winner_id'
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [
            'game_mode' => GameMode::class,
            'board' => 'array'
        ];
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class)->orderBy('order');
    }
}
