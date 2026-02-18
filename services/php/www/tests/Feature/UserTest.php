<?php

namespace Tests\Feature;

use App\Enums\Language;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use function PHPUnit\Framework\assertEquals;
use function PHPUnit\Framework\assertSame;


class UserTest extends TestCase
{
    use RefreshDatabase;

    // It's not even worth to test: Page size, page, sort order. It's all trivially correct.
    public function test_get_users_page_size()
    {
        User::factory()->createMany(11);

        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->getJson("/v1/users");
        $response->assertOk();
        $data = $response->json();
        assertSame(count($data['data']), config('social.default_page_size'));
    }


    public function test_user_creation()
    {
        $response = $this->postJson("/register", [
            'username' => 'userexample',
            'email' => 'user@example.nexus',
            'password' => 'passwordabcd1234',
        ])
        ->assertCreated();

        $this->assertDatabaseHas('users', [
            'email' => 'user@example.nexus',
            'name' => 'userexample',
        ]);
    }

    public function test_get_own_user()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->getJson("/v1/user")->assertOk();

        $response->assertJsonStructure([
            'id',
            'username',
            'email',
            'avatar',
            'bio',
            'total_experience',
        ]);
    }

    public function test_user_password_update()
    {
        $user = User::factory()->create([
            'password' => Hash::make('password'),
        ]);

        $this->actingAs($user);

        $response = $this->putJson("/v1/user/password/update", [
            'password' => 'newpassword',
            'password_confirm' => 'newpassword'
        ])
        ->assertOk();

        $this->assertTrue(
            Hash::check('newpassword', $user->fresh()->password)
        );
    }

    public function test_user_update()
    {
        $user = User::factory()->create();

        $this->actingAs($user);

        $response = $this->patchJson("/v1/user/update", [
            'username' => 'Updated Name',
            'email' => 'updated@example.com',
            'bio' => 'Updated bio',
            'language' => Language::ENGLISH->value
        ])
        ->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
            'bio' => 'Updated bio',
            'language' => Language::ENGLISH->value,
        ]);
    }
}
