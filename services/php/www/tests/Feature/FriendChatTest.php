<?php

namespace Tests\Feature;

use App\Enums\FriendshipStatus;
use App\Models\Chat;
use App\Models\Friendship;
use App\Services\FriendshipService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;
use function PHPUnit\Framework\assertTrue;


/**
 * Messaging testing is done in a different test, do not test messages.
 */
class FriendChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_friendship_creates_chat()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $service = new FriendshipService();

        $friendship = $service->createFriendship($user1, $user2);

        $chat = Chat::find($friendship->chat_id);

        assertNotNull($chat);
    }

    public function test_deleted_friendship_soft_deletes_chat()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $service = new FriendshipService();

        $friendship = $service->createFriendship($user1, $user2);

        $service->deleteFriendship($user1, $user2);

        $nonTrashedChat = Chat::find($friendship->chat_id);
        $trashedChat =  Chat::withTrashed()->find($friendship->chat_id);

        assertNotNull($trashedChat);
        assertNull($nonTrashedChat);
    }

    public function test_restored_friendship_restores_chat()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $service = new FriendshipService();

        $firstFriendship = $service->createFriendship($user1, $user2);

        $service->deleteFriendship($user1, $user2);

        $friendship = $service->createFriendship($user1, $user2);

        assertSame($friendship->chat->id, $firstFriendship->chat->id);
    }

    public function test_friends_are_chat_members()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $service = new FriendshipService();

        $friendship = $service->createFriendship($user1, $user2);

        $chat = Chat::find($friendship->chat_id);

        $members = $chat->members;

        assertSame($members->count(), 2);
        assertTrue($members->contains('id', $user1->id));
        assertTrue($members->contains('id', $user2->id));
    }

    public function test_members_can_read_chat()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $service = new FriendshipService();

        $friendship = $service->createFriendship($user1, $user2);

        $chat = Chat::find($friendship->chat_id);

        $this->actingAs($user1);

        $this->getJson("/v1/chats/$chat->id")->assertOk();

        $this->actingAs($user2);

        $this->getJson("/v1/chats/$chat->id")->assertOk();
    }

    public function test_guest_cant_read_friend_chat()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $service = new FriendshipService();

        $friendship = $service->createFriendship($user1, $user2);

        $chat = Chat::find($friendship->chat_id);

        $this->getJson("/v1/chats/$chat->id")->assertForbidden();
    }

    public function test_outsider_cant_read_friend_chat()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        $service = new FriendshipService();

        $friendship = $service->createFriendship($user1, $user2);

        $chat = Chat::find($friendship->chat_id);

        $this->actingAs($user3);

        $this->getJson("/v1/chats/$chat->id")->assertForbidden();
    }
}
