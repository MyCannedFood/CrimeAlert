<?php

namespace App\Services;

use App\Enums\CrimeStatus;
use App\Models\Crime;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class CrimeService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Crime::query()->with('photos');

        if ($province = $filters['province'] ?? null) {
            $query->where('province', $province);
        }

        if ($city = $filters['city'] ?? null) {
            $query->where('city', $city);
        }

        if ($category = $filters['category'] ?? null) {
            $query->where('category', $category);
        }

        if ($severity = $filters['severity'] ?? null) {
            $query->where('severity', $severity);
        }

        if ($status = $filters['status'] ?? null) {
            $query->where('status', $status);
        } else {
            $query->whereIn('status', [CrimeStatus::Verified, CrimeStatus::Reported]);
        }

        if ($search = $filters['search'] ?? null) {
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('province', 'ilike', "%{$search}%")
                  ->orWhere('city', 'ilike', "%{$search}%");
            });
        }

        if ($dateFrom = $filters['date_from'] ?? null) {
            $query->where('date', '>=', $dateFrom);
        }

        if ($dateTo = $filters['date_to'] ?? null) {
            $query->where('date', '<=', $dateTo);
        }

        $sortField = $filters['sort_by'] ?? 'date';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortField, $sortOrder);

        $perPage = $filters['per_page'] ?? 20;
        return $query->paginate($perPage);
    }

    public function findById(int $id): ?Crime
    {
        return Crime::with(['photos', 'reporter'])->find($id);
    }

    public function create(array $data): Crime
    {
        return Crime::create($data);
    }

    public function update(Crime $crime, array $data): Crime
    {
        $crime->update($data);
        return $crime->fresh();
    }

    public function delete(Crime $crime): bool
    {
        return $crime->delete();
    }

    public function verify(Crime $crime, int $verifierId): Crime
    {
        $crime->update([
            'status' => CrimeStatus::Verified,
            'verifier_id' => $verifierId,
        ]);
        return $crime->fresh();
    }
}
