<?php

namespace Tests\Feature;

use App\Enums\FriendshipStatus;
use App\Models\Friendship;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;
use function PHPUnit\Framework\assertTrue;


class FriendshipTest extends TestCase
{
    use RefreshDatabase;

    public function test_send_friend_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id")->assertCreated();

        $friendship = Friendship::where('user_id', $user->id)->where('friend_id', $friend->id)->first();
        
        assertNotNull($friendship);
        assertSame($friendship->status, FriendshipStatus::PENDING->value);
    }

    public function test_guest_friend_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();
        
        $this->actingAsGuest();

        $this->postJson("/v1/users/$user->id/friends/$friend->id")->assertUnauthorized();

        $friendship = Friendship::where('user_id', $user->id)->where('friend_id', $friend->id)->first();
        
        assertNull($friendship);
    }

    public function test_unauth_friend_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();
        $randomUser = User::factory()->create();

        $this->actingAs($randomUser);

        $this->postJson("/v1/users/$user->id/friends/$friend->id")->assertForbidden();

        $friendship = Friendship::where('user_id', $user->id)->where('friend_id', $friend->id)->first();
        
        assertNull($friendship);
    }

    public function test_befriend_itself()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$user->id")->assertForbidden();

        $friendship = Friendship::where('user_id', $user->id)->where('friend_id', $user->id)->first();
        
        assertNull($friendship);
    }

    public function test_pending_request_already_exists()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");
        $this->postJson("/v1/users/$user->id/friends/$friend->id")->assertConflict();

        $count = Friendship::where('user_id', $user->id)->where('friend_id', $friend->id)->count(1);
        
        assertSame($count, 1);
    }

    public function test_accept_friend_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", [
            'action' => 'accept',
        ])->assertOk();

        $friendship = Friendship::where('user_id', $user->id)->where('friend_id', $friend->id)->first();

        assert($friendship->status, FriendshipStatus::ACCEPTED->value);
    }

    public function test_reject_friend_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", [
            'action' => 'reject',
        ])->assertOk();

        $friendship = Friendship::where('user_id', $user->id)->where('friend_id', $friend->id)->first();

        assert($friendship->status, FriendshipStatus::REJECTED->value);
    }

    public function test_rare_update()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", [])->assertUnprocessable();
    }

    public function test_unknown_action_update()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'blablabla',])->assertUnprocessable();
    }

    public function test_accept_own_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->patchJson("/v1/users/$user->id/friends/$friend->id", ['action' => 'accept',])->assertForbidden();
    }

    public function test_reject_own_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->patchJson("/v1/users/$user->id/friends/$friend->id", ['action' => 'reject',])->assertForbidden();
    }

    public function test_accept_accepted_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'accept']);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'accept'])->assertForbidden();
    }

    public function test_reject_accepted_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'accept']);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'reject'])->assertForbidden();
    }

    public function test_accept_rejected_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'reject']);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'accept'])->assertForbidden();
    }

    public function test_reject_rejected_request()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);
        
        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'reject']);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'reject'])->assertForbidden();
    }

    public function test_cant_send_request_to_existing_friend()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'accept']);

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$friend->id")->assertForbidden();

        $friendship = Friendship::where('requester_id', $user->id)->first();
        assertSame($friendship->status, FriendshipStatus::ACCEPTED->value);
    }

    public function test_resend_immediately_fails()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'reject']);

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$friend->id")->assertForbidden();

        $friendship = Friendship::where('requester_id', $user->id)->first();
        assertSame($friendship->status, FriendshipStatus::REJECTED->value);
    }

    public function test_remove_friend()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'accept']);

        $this->deleteJson("/v1/users/$friend->id/friends/$user->id")->assertNoContent();

        $friendship = Friendship::where('requester_id', $user->id)->withTrashed()->first();
        assertTrue($friendship->trashed());
    }

    public function test_send_request_after_removal()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'accept']);

        $this->deleteJson("/v1/users/$friend->id/friends/$user->id");

        $this->postJson("/v1/users/$friend->id/friends/$user->id")->assertCreated();

        $friendship = Friendship::where('requester_id', $friend->id)->first();

        assertSame($friendship->status, FriendshipStatus::PENDING->value);
    }

    public function test_send_after_itself_rejected()
    {
        $user = User::factory()->create();
        $friend = User::factory()->create();

        $this->actingAs($user);

        $this->postJson("/v1/users/$user->id/friends/$friend->id");

        $this->actingAs($friend);

        $this->patchJson("/v1/users/$friend->id/friends/$user->id", ['action' => 'reject']);

        $this->postJson("/v1/users/$friend->id/friends/$user->id")->assertCreated();

        $friendship = Friendship::where('requester_id', $friend->id)->first();

        assertSame($friendship->status, FriendshipStatus::PENDING->value);
    }
}
