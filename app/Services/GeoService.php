<?php

namespace App\Services;

use App\Enums\CrimeStatus;
use App\Models\Crime;
use Illuminate\Support\Facades\DB;

class GeoService
{
    public function nearby(float $lat, float $lng, float $radiusKm = 5): array
    {
        $distanceSql = "ST_Distance(
            ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography,
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        )";

        return Crime::select('id', 'title', 'category', 'severity', 'province', 'city', 'date', 'source', 'latitude', 'longitude')
            ->selectRaw("{$distanceSql} as distance_m")
            ->where('status', CrimeStatus::Verified)
            ->whereRaw("{$distanceSql} < ?", [$lng, $lat, $radiusKm * 1000])
            ->orderBy('distance_m')
            ->get()
            ->toArray();
    }

    public function heatmap(): array
    {
        return Crime::where('status', CrimeStatus::Verified)
            ->select('id', 'title', 'category', 'severity', 'province', 'city', 'latitude', 'longitude', 'date', 'source', 'trend')
            ->selectRaw("CASE
                WHEN severity = 'safe' THEN 0.3
                WHEN severity = 'moderate' THEN 0.6
                WHEN severity = 'high' THEN 0.8
                WHEN severity = 'danger' THEN 1.0
            END as intensity")
            ->get()
            ->toArray();
    }
}
