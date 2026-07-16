<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

Route::any('/{any}', function ($any) {
    $fastapiUrl = env('NEWS_SCRAPER_URL', 'http://localhost:10000') . '/api/' . $any;

    $query = request()->query();
    if (!empty($query)) {
        $fastapiUrl .= '?' . http_build_query($query);
    }

    try {
        $response = Http::timeout(30)->withHeaders([
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ])->send(request()->method(), $fastapiUrl, [
            'body' => request()->getContent(),
        ]);

        return response($response->body(), $response->status())
            ->withHeaders(['Content-Type' => 'application/json']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 502);
    }
})->where('any', '.*');
