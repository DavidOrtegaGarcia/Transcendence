<?php

namespace App\Http\Controllers;

use App\Enums\FriendshipStatus;
use App\Models\Chat;
use App\Models\Friendship;
use App\Models\Message;
use App\Models\User;
use App\Services\ChatService;
use App\Services\FriendshipService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class ChatController 
{
    public function getChat(Chat $chat, ChatService $chatService)
    {
        $chatService->validateUserCanReadChat(Auth::user(), $chat);
    
        return response()->json([
            'visibility' => $chat->visibility,
            // 'messages' => $chat->messages,
        ], 200);
    }

    public function postMessage(Chat $chat, Request $request, ChatService $chatService)
    {
        $request->validate(['text' => ['required', 'string', 'min:1', 'max:' . config('social.max_message_size')]]);

        $message = $chatService->postMessage($chat, Auth::user(), $request->input('text'));

        return response()->json([
            'text' => $message->text,
            'user_id' => $message->user_id,
            'chat_id' => $message->chat_id
        ], 201);
    }

    public function editMessage(Message $message, Request $request, ChatService $chatService)
    {
        $request->validate(['text' => ['required', 'string', 'min:1', 'max:' . config('social.max_message_size')],]);
        
        $message = $chatService->editMessage(Auth::user(), $message, $request->input('text'));

        return response()->json([
            'text' => $message->text,
            'user_id' => $message->user_id,
            'chat_id' => $message->chat_id
        ], 200);
    }

    public function readMessage(Message $message, ChatService $service)
    {
        $service->seeMessage(Auth::user(), $message);

        return response()->json([], 200);
    }
}