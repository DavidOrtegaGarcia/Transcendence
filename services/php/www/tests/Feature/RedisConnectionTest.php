<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Redis;
use Tests\TestCase;

class RedisConnectionTest extends TestCase
{
    /** @test */
    public function it_can_connect_to_redis_and_set_a_key()
    {
        Redis::set('phpunit_test_key', 'connected');

        $value = Redis::get('phpunit_test_key');

        $this->assertEquals('connected', $value);

        Redis::del('phpunit_test_key');
    }
}
