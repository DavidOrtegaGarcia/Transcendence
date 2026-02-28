<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class MediaController extends Controller
{
    public function getMedia(string $path)
    {
        $filePath = 'media/' . $path;

        if (!Storage::disk('public')->exists($filePath)) 
        {
            abort(404);
        }

        return Storage::disk('public')->response($filePath);
    }
}