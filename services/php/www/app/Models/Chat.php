<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class Chat extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;

    protected $table = "chats";
    
    protected $fillable = [
        'visibility'
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [
        ];
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class,'user_chat','chat_id','user_id')->withPivot('last_message_seen_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::Class);
    }

    public function getLastSeenMessageAttribute()
    {
        $pivot = $this->members()->where('user_id', Auth::id())->first()?->pivot;

        if (!$pivot) 
        {
            return null;
        }

        return $this->messages()->where('id', $pivot->last_seen_message_id)->first();
    }
}
