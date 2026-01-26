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
        'type',
        'board_state',
        'parameters'
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [
            'type' => GameMode::class,
            'board_state' => 'array',
            'parameters' => 'array',
        ];
    }

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class)->orderBy('order');
    }
}
