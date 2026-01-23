<?php

namespace App\Models;

use App\Enums\ChatVisibility;
use App\Enums\FriendshipStatus;
use DB;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Friendship extends Model
{
    use HasFactory, SoftDeletes;

    public $timestamps = false;
    
    protected $table = "friendships";

    protected $fillable = [
        'user_id',
        'friend_id',
        'chat_id',
        'status',
        'rejected_at',
        'unblocked_at',
        'requester_id',
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [
        'rejected_at'    => 'datetime',
        'unblocked_at'    => 'datetime',
        ];
    }

    public function requester(): BelongsTo 
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function chat(): BelongsTo 
    {
        return $this->belongsTo(Chat::class, 'chat_id');
    }

    public function deletedChat(): BelongsTo 
    {
        return $this->belongsTo(Chat::class, 'chat_id')->withTrashed();
    }

    public function scopeBetween(Builder $query, int $a_id, int $b_id): Builder
    {
        return $query->where(function ($q) use ($a_id, $b_id) {
            $q->where('user_id', $a_id)
                ->where('friend_id', $b_id);
        })->orWhere(function ($q) use ($a_id, $b_id) {
            $q->where('user_id', $b_id)
                ->where('friend_id', $a_id);
        });
    }

    public function getPendingAttribute(): bool
    {
        return $this->status === FriendshipStatus::PENDING->value;
    }

    public function getRejectedAttribute(): bool
    {
        return $this->status === FriendshipStatus::REJECTED->value;
    }

    public function getAcceptedAttribute(): bool
    {
        return $this->status === FriendshipStatus::ACCEPTED->value;
    }

    protected static function booted(): void
    {
        static::created(function (Friendship $friendship) 
        {
            DB::transaction(function () use ($friendship) {
                $chat = Chat::create([
                    'visibility' => ChatVisibility::PRIVATE->value
                ]);
                $friendship->chat()->associate($chat);
                $chat->members()->sync([$friendship->user_id, $friendship->friend_id]);
                $chat->save();
                $friendship->save();
            });


        });

        static::restored(function (Friendship $friendship) 
        {
            $friendship->deletedChat->restore();
        });

        static::deleted(function (Friendship $friendship) {
            $friendship->chat->delete();
        });
    }
}
