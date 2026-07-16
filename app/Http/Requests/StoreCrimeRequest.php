<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCrimeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'severity' => 'required|in:safe,moderate,high,danger',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'province' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'source' => 'nullable|string|max:200',
            'source_url' => 'nullable|url|max:500',
        ];
    }
}
