<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name', 'slug', 'icon', 'severity_weight',
    ];

    public function crimes(): HasMany
    {
        return $this->hasMany(Crime::class, 'category_id');
    }
}
