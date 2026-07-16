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
            'select' => 'id,title,category,severity,latitude,longitude,province,city,date,source,trend,description,status',
            'order' => 'date.desc',
        ];

        if ($province = $request->province) {
            $params['province'] = "eq.{$province}";
        }
        if ($city = $request->city) {
            $params['city'] = "eq.{$city}";
        }
        if ($category = $request->category) {
            $params['category'] = "eq.{$category}";
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

        return response()->json($this->supabase->select('crimes', $params));
    }

    public function show(int $id): JsonResponse
    {
        $result = $this->supabase->select('crimes', [
            'select' => '*',
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
            'category' => 'required|string|max:100',
            'severity' => 'required|in:safe,moderate,high,danger',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:200',
        ]);

        $crime = $this->supabase->insert('crimes', $validated, useServiceRole: true);

        if (!$crime) {
            return response()->json(['message' => 'Failed to create crime'], 500);
        }

        return response()->json($crime, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $crime = $this->supabase->update('crimes', $request->all(), 'id', $id, useServiceRole: true);

        if (!$crime) {
            return response()->json(['message' => 'Crime not found'], 404);
        }

        return response()->json($crime);
    }

    public function destroy(int $id): JsonResponse
    {
        $deleted = $this->supabase->delete('crimes', 'id', $id, useServiceRole: true);

        if (!$deleted) {
            return response()->json(['message' => 'Crime not found'], 404);
        }

        return response()->json(null, 204);
    }

    public function verify(int $id): JsonResponse
    {
        $crime = $this->supabase->update('crimes', [
            'status' => 'verified',
        ], 'id', $id, useServiceRole: true);

        if (!$crime) {
            return response()->json(['message' => 'Crime not found'], 404);
        }

        return response()->json($crime);
    }
}
