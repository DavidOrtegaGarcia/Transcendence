<?php

namespace App\Enums;

enum ChatVisibility: string
{
    case PUBLIC = "public";
    case AUTHORIZED = "authorized";
    case PRIVATE = "private";
}