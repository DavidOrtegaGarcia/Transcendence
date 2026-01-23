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

class TeamMember extends Model
{
    use HasFactory;
    
    public $timestamps = false;

    protected $table = "team_user";


    protected $fillable = [
        'order',
        'user_id',
        'team_id'
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [];
    }

    
}
