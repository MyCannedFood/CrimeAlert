<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;

class StatsController extends Controller
{
    public function __construct(
        private readonly SupabaseService $supabase
    ) {}

    public function summary(): JsonResponse
    {
        $crimes = $this->supabase->select('crimes', ['select' => 'severity,status,date,province']);

        $total = count($crimes);
        $resolved = count(array_filter($crimes, fn($c) => ($c['status'] ?? null) === 'verified'));
        $highRiskRegions = count(array_unique(array_filter(
            array_map(fn($c) => ($c['severity'] ?? '') === 'high' || ($c['severity'] ?? '') === 'danger' ? ($c['province'] ?? '') : null, $crimes)
        )));

        $dates = array_filter(array_column($crimes, 'date'));
        $avgDaily = 0;
        if (!empty($dates)) {
            $minDate = min($dates);
            $days = max((int) ceil((time() - strtotime($minDate)) / 86400), 1);
            $avgDaily = round($total / $days, 2);
        }

        return response()->json([
            'total_cases' => $total,
            'resolved_cases' => $resolved,
            'high_risk_regions' => $highRiskRegions,
            'avg_daily_cases' => $avgDaily,
        ]);
    }

    public function byCategory(): JsonResponse
    {
        $crimes = $this->supabase->select('crimes', ['select' => 'category']);
        $categories = [];
        $total = count($crimes);

        foreach ($crimes as $c) {
            $cat = $c['category'] ?? 'Unknown';
            $categories[$cat] = ($categories[$cat] ?? 0) + 1;
        }

        arsort($categories);

        $result = [];
        foreach ($categories as $name => $count) {
            $result[] = [
                'name' => $name,
                'total' => $count,
                'percent' => $total > 0 ? round($count / $total * 100, 1) : 0,
            ];
        }

        return response()->json($result);
    }

    public function byProvince(): JsonResponse
    {
        $crimes = $this->supabase->select('crimes', ['select' => 'province,severity']);
        $provinces = [];

        foreach ($crimes as $c) {
            $prov = $c['province'] ?? 'Unknown';
            if (!isset($provinces[$prov])) {
                $provinces[$prov] = ['total' => 0, 'max_severity' => 'safe'];
            }
            $provinces[$prov]['total']++;
            $severity = $c['severity'] ?? 'safe';
            $order = ['safe' => 0, 'moderate' => 1, 'high' => 2, 'danger' => 3];
            if (($order[$severity] ?? 0) > ($order[$provinces[$prov]['max_severity']] ?? 0)) {
                $provinces[$prov]['max_severity'] = $severity;
            }
        }

        uasort($provinces, fn($a, $b) => $b['total'] <=> $a['total']);

        $result = [];
        foreach ($provinces as $province => $data) {
            $result[] = [
                'province' => $province,
                'total' => $data['total'],
                'max_severity' => $data['max_severity'],
            ];
        }

        return response()->json($result);
    }

    public function monthlyTrend(): JsonResponse
    {
        $crimes = $this->supabase->select('crimes', ['select' => 'date']);
        $months = [];

        foreach ($crimes as $c) {
            if (!empty($c['date'])) {
                $month = substr($c['date'], 0, 7);
                $months[$month] = ($months[$month] ?? 0) + 1;
            }
        }

        ksort($months);

        $result = [];
        foreach ($months as $month => $incidents) {
            $result[] = ['month' => $month, 'incidents' => $incidents];
        }

        return response()->json($result);
    }
}
