<?php

namespace App\Http\Controllers;

use App\Enums\FriendshipHttpAction;
use App\Enums\FriendshipStatus;
use App\Models\Friendship;
use App\Models\User;
use App\Services\FriendshipService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\UnauthorizedException;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;

class FriendshipController 
{
    public function sendFriendRequest(User $user, User $friend, FriendshipService $service)
    {
        if ($user->id != Auth::id() || $user->id == $friend->id)
        {
            abort(403, __('errors.unauthorized'));
        }

        $friendship = $service->createFriendship($user, $friend);

        return response()->json([
            'user_id' => $friendship->user_id,
            'friend_id' => $friendship->friend_id,
            'requester_id' => $friendship->requester_id,
            'status' => $friendship->status,
            'chat_id' => $friendship->chat_id
        ], 201);
    }

    public function updateFriendship(User $user, User $friend, Request $request, FriendshipService $service)
    {
        $request->validate(['action' => ['required', Rule::enum(FriendshipHttpAction::class)]]);

        if ($user->id != Auth::id() || $user->id == $friend->id)
        {
            abort(403, __('errors.unauthorized'));
        }

        $friendship = $service->replyToFriendshipRequest($user, $friend, $request->action);

        return response()->json([
            'user_id' => $friendship->user_id,
            'friend_id' => $friendship->friend_id,
            'requester_id' => $friendship->requester_id,
            'status' => $friendship->status,
            'chat_id' => $friendship->chat_id
        ], 200);
    }

    public function deleteFriendship(User $user, User $friend, FriendshipService $service)
    {
        if ($user->id != Auth::id() || $user->id == $friend->id)
        {
            abort(403, __('errors.unauthorized'));
        }

        $service->deleteFriendship($user, $friend);

        return response()->json([], 204);
    }
}