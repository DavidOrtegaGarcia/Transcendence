<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessageReceipt extends Model
{
    use HasFactory;

    protected $table = "message_receipt";

    protected $fillable = [
        'seen_at',
        'user_id',
        'message_id',
    ];

    protected $hidden = [
    ];

    protected function casts(): array
    {
        return [
            'seen_at'    => 'datetime',
        ];
    }
}