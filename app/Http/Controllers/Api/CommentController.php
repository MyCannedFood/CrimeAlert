<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(string $id, SupabaseService $supabase)
    {
        $comments = $supabase->select('report_comments', ['report_id' => "eq.{$id}"], true);
        if (!$comments) return response()->json([]);
        usort($comments, fn($a, $b) => strtotime($a['created_at'] ?? 0) - strtotime($b['created_at'] ?? 0));
        return response()->json($comments);
    }

    public function store(Request $request, string $id, SupabaseService $supabase)
    {
        $authUser = $request->input('auth_user');
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|integer',
        ]);

        $payload = [
            'report_id' => $id,
            'user_id' => $authUser['id'],
            'username' => $authUser['email'] ?? 'Anonim',
            'content' => $data['content'],
            'parent_id' => $data['parent_id'] ?? null,
            'created_at' => now()->toIso8601String(),
        ];

        $result = $supabase->insert('report_comments', $payload, true);

        if (!$result) {
            return response()->json(['error' => 'Gagal menambahkan komentar'], 500);
        }

        return response()->json($result, 201);
    }

    public function update(Request $request, string $id, SupabaseService $supabase)
    {
        $authUser = $request->input('auth_user');
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $data = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $comments = $supabase->select('report_comments', ['id' => "eq.{$id}"], true);
        $comment = $comments[0] ?? null;

        if (!$comment) {
            return response()->json(['error' => 'Komentar tidak ditemukan'], 404);
        }

        if (($comment['user_id'] ?? '') !== $authUser['id']) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!empty($comment['deleted_at'])) {
            return response()->json(['error' => 'Komentar sudah dihapus'], 400);
        }

        $result = $supabase->update('report_comments', [
            'content' => $data['content'],
        ], 'id', $id, true);

        if (!$result) {
            return response()->json(['error' => 'Gagal mengedit komentar'], 500);
        }

        return response()->json($result);
    }

    public function destroy(string $id, Request $request, SupabaseService $supabase)
    {
        $authUser = $request->input('auth_user');
        if (!$authUser) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        $comments = $supabase->select('report_comments', ['id' => "eq.{$id}"], true);
        $comment = $comments[0] ?? null;

        if (!$comment) {
            return response()->json(['error' => 'Komentar tidak ditemukan'], 404);
        }

        if (($comment['user_id'] ?? '') !== $authUser['id']) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $supabase->delete('report_comments', 'parent_id', $id, true);
        $deleted = $supabase->delete('report_comments', 'id', $id, true);

        if (!$deleted) {
            return response()->json(['error' => 'Gagal menghapus komentar'], 500);
        }

        return response()->json(null, 204);
    }
}
