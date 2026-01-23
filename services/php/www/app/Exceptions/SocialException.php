<?php

namespace App\Exceptions;

use RuntimeException;

class SocialException extends RuntimeException
{
    protected int $status;

    public function __construct(string $message, int $status)
    {
        parent::__construct($message);
        $this->status = $status;
    }

    public function status(): int
    {
        return $this->status;
    }
}
