<?php

namespace Tests\Feature;

use App\Enums\ChatVisibility;
use App\Enums\FriendshipStatus;
use App\Models\Chat;
use App\Models\Friendship;
use App\Models\Message;
use App\Services\FriendshipService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;
use App\Models\User;
use function PHPUnit\Framework\assertNotNull;
use function PHPUnit\Framework\assertNull;
use function PHPUnit\Framework\assertSame;
use function PHPUnit\Framework\assertTrue;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    public function test_only_members_can_read_private_chat()
    {
        $chat = Chat::create([
            'visibility' => ChatVisibility::PRIVATE->value
        ]);

        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $chat->members()->sync([$user]);

        $this->actingAs($otherUser);

        $this->getJson("/v1/chats/$chat->id")->assertForbidden();

        $this->actingAs($user);

        $this->getJson("/v1/chats/$chat->id")->assertOk();

        $this->actingAsGuest();

        $this->getJson("/v1/chats/$chat->id")->assertForbidden();


    }

    public function test_everyone_can_read_public_chat()
    {
        $chat = Chat::create([
            'visibility' => ChatVisibility::PUBLIC->value
        ]);

        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $chat->members()->sync([$user]);

        $this->actingAs($otherUser);

        $this->getJson("/v1/chats/$chat->id")->assertOk();

        $this->actingAsGuest();

        $this->getJson("/v1/chats/$chat->id")->assertOk();

        $this->actingAs($user);

        $this->getJson("/v1/chats/$chat->id")->assertOk();
    }


    public function test_only_users_can_read_auth_chat()
    {
        $chat = Chat::create([
            'visibility' => ChatVisibility::AUTHORIZED->value
        ]);

        $user = User::factory()->create();
        $otherUser = User::factory()->create();

        $chat->members()->sync([$user]);

        $this->actingAs($otherUser);

        $this->getJson("/v1/chats/$chat->id")->assertOk();

        $this->actingAsGuest();

        $this->getJson("/v1/chats/$chat->id")->assertForbidden();

        $this->actingAs($user);

        $this->getJson("/v1/chats/$chat->id")->assertOk();
    }

    public function test_post_message()
    {
        $chat = Chat::create(['visibility' => ChatVisibility::PUBLIC->value]);

        $user = User::factory()->create();

        $chat->members()->sync([$user]);

        $this->actingAs($user);

        $this->postJson("/v1/chats/$chat->id/messages", ['text' => 'Hello, world!'])->assertCreated();

        $message = Message::where('text', 'Hello, world!')->first();

        assertNotNull($message);
    }

    public function test_edit_message()
    {
        $chat = Chat::create(['visibility' => ChatVisibility::PUBLIC->value]);

        $user = User::factory()->create();

        $chat->members()->sync([$user]);

        $this->actingAs($user);

        $this->postJson("/v1/chats/$chat->id/messages", ['text' => 'Hello, world!']);

        $message = Message::where('text', 'Hello, world!')->first();

        $this->patchJson("/v1/messages/$message->id", ['text' => 'Hello, jupiter!'])->assertOk();

        $message = Message::where('text', 'Hello, jupiter!')->first();

        assertNotNull($message);
    }

    public function test_guest_cant_post_message()
    {
        $chat = Chat::create(['visibility' => ChatVisibility::PUBLIC->value]);

        $user = User::factory()->create();

        $chat->members()->sync([$user]);

        $this->postJson("/v1/chats/$chat->id/messages", ['text' => 'Hello, world!'])->assertUnauthorized();
    }

    public function test_only_owner_can_edit_message()
    {
        $chat = Chat::create(['visibility' => ChatVisibility::PUBLIC->value]);

        $user1 = User::factory()->create();
        $user = User::factory()->create();

        $message = Message::create([
            'text' => 'Hello',
            'user_id' => $user1->id,
            'chat_id' => $chat->id,
        ]);

        $this->actingAsGuest();
        
        $this->patchJson("/v1/messages/$message->id", ['text' => 'Hello, jupiter!'])->assertUnauthorized();

        $this->actingAs($user);

        $this->patchJson("/v1/messages/$message->id", ['text' => 'Hello, jupiter!'])->assertForbidden();
    }

    public function test_message_and_message_edit_constraints()
    {
        $chat = Chat::create(['visibility' => ChatVisibility::PUBLIC->value]);

        $user = User::factory()->create();

        $chat->members()->sync([$user]);

        $this->actingAs($user);

        $this->postJson("/v1/chats/$chat->id/messages", ['text' => ''])->assertUnprocessable();
        $this->postJson("/v1/chats/$chat->id/messages", [])->assertUnprocessable();
        $this->postJson("/v1/chats/$chat->id/messages", ['text' => Str::random(1 + config('social.max_message_size'))])->assertUnprocessable();
        $this->postJson("/v1/chats/$chat->id/messages", ['text' => Str::random(config('social.max_message_size'))])->assertCreated();

        $message = Message::where('chat_id', $chat->id)->first();

        $this->patchJson("/v1/messages/$message->id", ['text' => ''])->assertUnprocessable();
        $this->patchJson("/v1/messages/$message->id", [])->assertUnprocessable();
        $this->patchJson("/v1/messages/$message->id", ['text' => Str::random(1 + config('social.max_message_size'))])->assertUnprocessable();
        $this->patchJson("/v1/messages/$message->id", ['text' => Str::random(config('social.max_message_size'))])->assertOk();
    }

    public function test_see_message()
    {
        $chat = Chat::create(['visibility' => ChatVisibility::PUBLIC->value]);

        $user1 = User::factory()->create();
        $user2 = User::factory()->create();

        $chat->members()->sync([$user1, $user2]);

        $message = Message::create([
            'text' => 'Hello',
            'user_id' => $user1->id,
            'chat_id' => $chat->id,
        ]);

        $this->actingAs($user2);

        $this->postJson("/v1/messages/$message->id/read")->assertOk();

        $chat = $chat->fresh('members'); 

        $member = $chat->members->firstWhere('id', $user2->id);

        assertSame($member->pivot->last_message_seen_id, $message->id);
    }

    /**
     * MORE: TEST SENDING WEBSOCKET TO READERS
     * TEST PRESCENSE CHANNEL
     */
}
