<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCrimeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:100',
            'severity' => 'sometimes|in:safe,moderate,high,danger',
            'latitude' => 'sometimes|numeric|between:-90,90',
            'longitude' => 'sometimes|numeric|between:-180,180',
            'province' => 'sometimes|string|max:100',
            'city' => 'sometimes|string|max:100',
            'date' => 'sometimes|date',
            'status' => 'sometimes|in:reported,verified,dismissed',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:200',
            'source_url' => 'nullable|url|max:500',
        ];
    }
}
