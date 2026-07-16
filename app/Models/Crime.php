<?php

namespace App\Models;

use App\Enums\CrimeSeverity;
use App\Enums\CrimeStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Crime extends Model
{
    protected $fillable = [
        'title', 'category', 'severity',
        'latitude', 'longitude',
        'province', 'city',
        'date', 'source', 'source_url',
        'trend', 'description', 'status',
        'reporter_id', 'verifier_id',
    ];

    protected function casts(): array
    {
        return [
            'severity' => CrimeSeverity::class,
            'status' => CrimeStatus::class,
            'date' => 'date',
            'latitude' => 'float',
            'longitude' => 'float',
        ];
    }

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verifier_id');
    }

    public function photos(): HasMany
    {
        return $this->hasMany(CrimePhoto::class);
    }
}
