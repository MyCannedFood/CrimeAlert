<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CrimeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'category' => $this->category,
            'severity' => $this->severity?->value,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'province' => $this->province,
            'city' => $this->city,
            'date' => $this->date?->toDateString(),
            'source' => $this->source,
            'source_url' => $this->source_url,
            'trend' => $this->trend,
            'description' => $this->description,
            'status' => $this->status?->value,
            'photos' => CrimePhotoResource::collection($this->whenLoaded('photos')),
            'reporter' => new UserResource($this->whenLoaded('reporter')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
