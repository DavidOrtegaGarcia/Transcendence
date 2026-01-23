<?php

namespace App\Services;

use App\Enums\FriendshipStatus;
use App\Exceptions\SocialException;
use App\Models\Friendship;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class FriendshipService 
{
    private function resendFriendRequest(User $requester, Friendship $friendship)
    {
        $friendship->update([
            'requester_id' => $requester->id,
            'status' => FriendshipStatus::PENDING->value,
        ]);

        return $friendship;
    }

    private function createNewFriendship(User $user_a, User $user_b): Friendship
    {
        return Friendship::create([
            'user_id' => $user_a->id,
            'friend_id' => $user_b->id,
            'requester_id' => $user_a->id,
            'status' => FriendshipStatus::PENDING->value,
        ]);;
    }

    private function restoreFriendship(User $requester, Friendship $friendship): Friendship
    {
        return DB::transaction(function () use ($requester, $friendship) {
            $friendship->restore();
            return $this->resendFriendRequest($requester, $friendship);
        });
    }

    private function acceptFriendship(User $replier, Friendship $friendship): Friendship
    {
        $friendship->update([
            'status' => FriendshipStatus::ACCEPTED->value
        ]);

        return $friendship;
    }

    private function rejectFriendship(User $replier, Friendship $friendship): Friendship
    {
        $friendship->update([
            'status' => FriendshipStatus::REJECTED->value
        ]);

        return $friendship;
    }

    public function replyToFriendshipRequest(User $replier, User $requester, string|null $action): Friendship
    {
        $friendship = Friendship::between($replier->id, $requester->id)->firstOrFail();

        if ($friendship->requester_id === $replier->id)
        {
            throw new SocialException(__('errors.reply_to_yourself'), 403);
        }
        if (!$friendship->pending)
        {
            throw new SocialException(__('errors.not_pending'), 403);
        }
        switch ($action)
        {
            case 'accept': return $this->acceptFriendship($replier, $friendship) ;
            case 'reject': return $this->rejectFriendship($replier, $friendship) ;
            default: abort(400);
        }
    }

    public function createFriendship(User $user_a, User $user_b): Friendship
    {
        $friendship = Friendship::between($user_a->id, $user_b->id)->withTrashed()->first();

        if (!$friendship)
        {
            $friendship = $this->createNewFriendship($user_a, $user_b);
        }
        else if ($friendship->trashed())
        {
            $friendship = $this->restoreFriendship($user_a, $friendship);
        }
        else 
        {
            if ($friendship->pending)
            {
                throw new SocialException(__('errors.pending_friend_request'), 409);
            }
            else if ($friendship->accepted)
            {
                throw new SocialException(__('errors.already_friends'), 403);
            }
            else if ($friendship->rejected && $friendship->requester->id == $user_a->id)
            {
                throw new SocialException(__('errors.rejected_friend'), 403);
            }
            else if ($friendship->rejected && $friendship->requester->id == $user_b->id)
            {
                $friendship = $this->resendFriendRequest($user_a, $friendship);
            }
            else 
            {
                $friendship = $this->createNewFriendship($user_a, $user_b);
            }
        }

        return $friendship;
    }

    public function deleteFriendship(User $user_a, User $user_b)
    {
        $friendship = Friendship::between($user_a->id, $user_b->id)->firstOrFail();

        $friendship->delete();
    }
}