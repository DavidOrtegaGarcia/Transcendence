<?php

namespace App\Services;

use App\Enums\ChatVisibility;
use App\Exceptions\SocialException;
use App\Models\Chat;
use App\Models\Message;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ChatService 
{
    public function validateUserCanSeeMessage(User $user, Message $message)
    {
        // They should be able to, at least to mark they read the messages before :) 
        // if ($message->user_id == $user->id)
        // {
        //     throw new SocialException(__('errors.cant_see_own_message'), 403);
        // }
    
        $lastSeenMessage = $message->chat->lastSeenMessage;
        if ($lastSeenMessage && $lastSeenMessage->created_at >= $message->created_at)
        {
            throw new SocialException(__('errors.message_already_seen'), 409);
        }
    }

    public function validateUserCanEditMessage(User | null $user, Message $message) 
    {
        if (!($user && $message->user_id === $user->id))
        {
            throw new SocialException(__('errors.you_cant_edit_message'), 403);
        }
    }

    // Provided the user can read it. (Keep function for future expansion. E.g blocked users.)
    public function validateUserCanPostMessage(Chat $chat, User | null $user) 
    {
        if ($user == null)
        {
            throw new SocialException(__('errors.must_login_to_comment'), 401);
        }
    }

    public function validateUserCanReadChat(User|null $user, Chat $chat)
    {
        if ($chat->visibility == ChatVisibility::PUBLIC->value)
        {
            return;
        }
        if ($chat->visibility == ChatVisibility::AUTHORIZED->value && $user != null)
        {
            return;
        }
        if ($chat->visibility == ChatVisibility::PRIVATE->value && $user != null)
        {
            if ($chat->members()->where('user_id', $user->id)->exists())
            {
                return ;
            }
        }
        throw new SocialException(__('errors.no_access_to_chat'), 403);
    }

    public function postMessage(Chat $chat, User|null $user, string $text): Message
    {
        $this->validateUserCanReadChat($user, $chat);
        $this->validateUserCanPostMessage($chat, $user);

        return DB::transaction(function () use ($chat, $user, $text) {
            return Message::create([
                'chat_id' => $chat->id,
                'user_id' => $user->id,
                'text' => $text,
            ]);
        });
    }

    public function editMessage(User|null $user, Message $message, string $text): Message
    {
        $this->validateUserCanEditMessage($user, $message);

        return DB::transaction(function () use ($message, $text) {
            $message->update([
                'text' => $text,
            ]);
            $message->save();
            return $message;
        });
    }

    public function seeMessage(User $user, Message $message)
    {
        $this->validateUserCanSeeMessage($user, $message);

        $chatMemberPivot = $message->chat->members()->where('user_id', $user->id)->firstOrFail()->pivot;
        $chatMemberPivot->last_message_seen_id = $message->id;
        $chatMemberPivot->save();
    }
}