<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GeoController extends Controller
{
    public function __construct(
        private readonly SupabaseService $supabase
    ) {}

    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
            'radius' => 'nullable|numeric|min:0.1|max:100',
        ]);

        $result = $this->supabase->rpc('nearby_crimes', [
            'p_lat' => $request->float('lat'),
            'p_lng' => $request->float('lng'),
            'p_radius_km' => $request->float('radius', 5),
        ]);

        return response()->json($result ?? []);
    }

    public function heatmap(): JsonResponse
    {
        $crimes = $this->supabase->select('crimes', [
            'select' => 'id,title,category,severity,province,city,latitude,longitude,date,source,trend',
            'status' => 'eq.verified',
        ]);

        $result = array_map(function ($c) {
            $intensityMap = ['safe' => 0.3, 'moderate' => 0.6, 'high' => 0.8, 'danger' => 1.0];
            $c['intensity'] = $intensityMap[$c['severity']] ?? 0.5;
            return $c;
        }, $crimes);

        return response()->json($result);
    }
}
