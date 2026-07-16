<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VerifySupabaseToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'No authentication token provided'], 401);
        }

        $supabaseUrl = rtrim(config('services.supabase.url', ''), '/');
        $anonKey = config('services.supabase.anon_key', '');

        if (empty($supabaseUrl) || empty($anonKey)) {
            return response()->json(['error' => 'Server configuration error'], 500);
        }

        $response = Http::withHeaders([
            'apikey' => $anonKey,
            'Authorization' => "Bearer {$token}",
        ])->get("{$supabaseUrl}/auth/v1/user");

        if (!$response->successful()) {
            return response()->json(['error' => 'Invalid or expired authentication token'], 401);
        }

        $request->merge(['auth_user' => $response->json()]);

        return $next($request);
    }
}
