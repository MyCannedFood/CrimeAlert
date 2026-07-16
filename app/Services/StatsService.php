<?php

namespace App\Services;

use App\Enums\CrimeStatus;
use App\Models\Crime;
use Illuminate\Support\Facades\DB;

class StatsService
{
    public function summary(): array
    {
        $total = Crime::count();
        $resolved = Crime::where('status', CrimeStatus::Verified)->count();
        $highRisk = Crime::whereIn('severity', ['high', 'danger'])
            ->distinct('province')
            ->count('province');

        $firstDate = Crime::min('date');
        $days = $firstDate ? max((int) now()->diffInDays($firstDate), 1) : 1;
        $avgDaily = round($total / $days, 2);

        return [
            'total_cases' => $total,
            'resolved_cases' => $resolved,
            'high_risk_regions' => $highRisk,
            'avg_daily_cases' => $avgDaily,
        ];
    }

    public function byCategory(): array
    {
        return Crime::select('category as name', DB::raw('count(*) as total'))
            ->groupBy('category')
            ->orderByDesc('total')
            ->get()
            ->each(function ($item) {
                $total = Crime::count();
                $item->percent = $total > 0 ? round($item->total / $total * 100, 1) : 0;
            })
            ->toArray();
    }

    public function byProvince(): array
    {
        return Crime::select(
                'province',
                DB::raw('count(*) as total'),
                DB::raw('max(severity) as max_severity')
            )
            ->groupBy('province')
            ->orderByDesc('total')
            ->get()
            ->toArray();
    }

    public function monthlyTrend(): array
    {
        return Crime::select(
                DB::raw("to_char(date, 'YYYY-MM') as month"),
                DB::raw('count(*) as incidents')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }
}
