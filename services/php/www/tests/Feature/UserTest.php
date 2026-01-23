<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
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

}
