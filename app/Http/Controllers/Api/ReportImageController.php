<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReportImageController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        $file = $request->file('image');
        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString() . '.' . $extension;

        Storage::disk('local')->putFileAs('report-images', $file, $filename);

        return response()->json(['id' => $filename]);
    }

    public function show(string $filename)
    {
        $path = 'report-images/' . $filename;

        if (!Storage::disk('local')->exists($path)) {
            return response()->json(['error' => 'Image not found'], 404);
        }

        $mimeType = Storage::disk('local')->mimeType($path);

        return response()->file(
            Storage::disk('local')->path($path),
            ['Content-Type' => $mimeType]
        );
    }
}
