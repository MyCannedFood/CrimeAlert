<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CrimeController extends Controller
{
    public function __construct(
        private readonly SupabaseService $supabase
    ) {}

    public function index(Request $request): JsonResponse
    {
        $params = [
            'select' => 'id,title,crime_type,severity,latitude,longitude,province,city,published,source,trend,description,status,url,image_url,relevance_score',
            'order' => $request->order ?? 'published.desc',
        ];

        if ($province = $request->province) {
            $params['province'] = "eq.{$province}";
        }
        if ($city = $request->city) {
            $params['city'] = "eq.{$city}";
        }
        if ($category = $request->category) {
            $params['crime_type'] = "eq.{$category}";
        }
        if ($severity = $request->severity) {
            $params['severity'] = "eq.{$severity}";
        }
        if ($search = $request->search) {
            $params['title'] = "ilike.%{$search}%";
        }
        if ($request->per_page) {
            $params['limit'] = $request->integer('per_page');
        }

        return response()->json($this->supabase->select('crime_articles', $params));
    }

    public function show(int $id): JsonResponse
    {
        $result = $this->supabase->select('crime_articles', [
            'select' => 'id,title,crime_type,severity,latitude,longitude,province,city,published,source,trend,description,status,url,image_url,relevance_score',
            'id' => "eq.{$id}",
        ]);

        if (empty($result)) {
            return response()->json(['message' => 'Crime not found'], 404);
        }

        return response()->json($result[0]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'crime_type' => 'required|string|max:100',
            'severity' => 'required|in:safe,moderate,high,danger',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'published' => 'required|date',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:200',
        ]);

        $crime = $this->supabase->insert('crime_articles', $validated, useServiceRole: true);

        if (!$crime) {
            return response()->json(['message' => 'Failed to create crime'], 500);
        }

        return response()->json($crime, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $crime = $this->supabase->update('crime_articles', $request->all(), 'id', $id, useServiceRole: true);

        if (!$crime) {
            return response()->json(['message' => 'Crime not found'], 404);
        }

        return response()->json($crime);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->supabase->delete('crime_articles', 'id', $id, useServiceRole: true);

        if (!$deleted) {
            return response()->json(['message' => 'Crime not found'], 404);
        }

        return response()->json(null, 204);
    }

    public function verify(int $id): JsonResponse
    {
        $crime = $this->supabase->update('crime_articles', [
            'status' => 'verified',
        ], 'id', $id, useServiceRole: true);

        if (!$crime) {
            return response()->json(['message' => 'Crime not found'], 404);
        }

        return response()->json($crime);
    }
}
