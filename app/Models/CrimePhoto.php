<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrimePhoto extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'crime_id', 'url', 'type',
    ];

    public function crime(): BelongsTo
    {
        return $this->belongsTo(Crime::class);
    }
}
