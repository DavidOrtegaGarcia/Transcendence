<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $table = "messages";

    protected $fillable = [
        'user_id',
        'chat_id',
        'text'
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [
        ];
    }

    public function chat(): BelongsTo 
    {
        return $this->belongsTo(Chat::class);
    }
}
