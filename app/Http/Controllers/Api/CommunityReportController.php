<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommunityReportController extends Controller
{
    public function index(Request $request, SupabaseService $supabase)
    {
        $params = [];

        if ($request->province) {
            $params['province'] = "eq.{$request->province}";
        }

        if ($request->search) {
            $params['title'] = "ilike.%{$request->search}%";
        }

        $sort = $request->sort === 'top' ? 'upvotes' : 'created_at';
        $params['order'] = "{$sort}.desc";

        $reports = $supabase->select('community_reports', $params, true);

        return response()->json($reports ?: []);
    }

    public function show(string $id, SupabaseService $supabase)
    {
        $reports = $supabase->select('community_reports', ['id' => "eq.{$id}"], true);
        $report = $reports[0] ?? null;

        if (!$report) {
            return response()->json(['error' => 'Laporan tidak ditemukan'], 404);
        }

        return response()->json($report);
    }

    public function store(Request $request, SupabaseService $supabase)
    {
        $authUser = $request->input('auth_user');
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $data['reporter_id'] = $authUser['id'];

        $result = $supabase->insert('community_reports', $data, true);

        if (!$result) {
            return response()->json(['error' => 'Gagal menyimpan laporan'], 500);
        }

        return response()->json($result, 201);
    }

    public function update(string $id, Request $request, SupabaseService $supabase)
    {
        $authUser = $request->input('auth_user');
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $reports = $supabase->select('community_reports', ['id' => "eq.{$id}"], true);
        $report = $reports[0] ?? null;

        if (!$report) {
            return response()->json(['error' => 'Laporan tidak ditemukan'], 404);
        }

        $data = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $result = $supabase->update('community_reports', $data, 'id', $id, true);

        if (!$result) {
            return response()->json(['error' => 'Gagal memperbarui laporan'], 500);
        }

        return response()->json($result);
    }

    public function destroy(string $id, Request $request, SupabaseService $supabase)
    {
        $authUser = $request->input('auth_user');
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $reports = $supabase->select('community_reports', ['id' => "eq.{$id}"], true);
        $report = $reports[0] ?? null;

        if (!$report) {
            return response()->json(['error' => 'Laporan tidak ditemukan'], 404);
        }

        if (!empty($report['image_url'])) {
            $path = 'report-images/' . $report['image_url'];
            if (Storage::disk('local')->exists($path)) {
                Storage::disk('local')->delete($path);
            }
        }

        $supabase->delete('report_votes', 'report_id', $id, true);
        $deleted = $supabase->delete('community_reports', 'id', $id, true);

        if (!$deleted) {
            return response()->json(['error' => 'Gagal menghapus laporan'], 500);
        }

        return response()->json(null, 204);
    }
}
