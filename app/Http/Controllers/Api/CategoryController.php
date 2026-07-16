<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function __construct(
        private readonly SupabaseService $supabase
    ) {}

    public function index(): JsonResponse
    {
        return response()->json(
            $this->supabase->select('categories', ['select' => '*', 'order' => 'name.asc'])
        );
    }
}
