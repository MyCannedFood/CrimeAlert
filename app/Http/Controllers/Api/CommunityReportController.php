<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CommunityReportController extends Controller
{
    public function store(Request $request, SupabaseService $supabase)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'username' => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:255',
            'reporter_id' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $result = $supabase->insert('community_reports', $data, true);

        if (!$result) {
            return response()->json(['error' => 'Gagal menyimpan laporan'], 500);
        }

        return response()->json($result, 201);
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

        $userId = $authUser['id'] ?? '';
        $userEmail = $authUser['email'] ?? '';
        $isOwner = ($report['reporter_id'] ?? '') === $userId;
        $isAdmin = $userEmail === env('ADMIN_EMAIL', '');

        if (!$isOwner && !$isAdmin) {
            return response()->json(['error' => 'Unauthorized'], 403);
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
