<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SupabaseService
{
    protected string $url;
    protected string $apiKey;
    protected string $serviceKey;

    public function __construct()
    {
        $this->url = rtrim(env('SUPABASE_URL', 'https://csmnagmoyuhlnmalxxcm.supabase.co'), '/') . '/rest/v1';
        $this->apiKey = env('SUPABASE_ANON_KEY', '');
        $this->serviceKey = env('SUPABASE_SERVICE_KEY', '');
    }

    protected function headers(bool $useServiceRole = false): array
    {
        return [
            'apikey' => $this->apiKey,
            'Authorization' => 'Bearer ' . ($useServiceRole ? $this->serviceKey : $this->apiKey),
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'Prefer' => 'return=representation',
        ];
    }

    public function select(string $table, array $params = [], bool $useServiceRole = false): array
    {
        $response = Http::withHeaders($this->headers($useServiceRole))
            ->withoutVerifying()
            ->get("{$this->url}/{$table}", $params);

        return $response->successful() ? $response->json() : [];
    }

    public function insert(string $table, array $data, bool $useServiceRole = false): ?array
    {
        $response = Http::withHeaders($this->headers($useServiceRole))
            ->withoutVerifying()
            ->post("{$this->url}/{$table}", $data);

        return $response->successful() ? ($response->json()[0] ?? null) : null;
    }

    public function update(string $table, array $data, string $filter, mixed $value, bool $useServiceRole = false): ?array
    {
        $response = Http::withHeaders(array_merge(
            $this->headers($useServiceRole),
            ['Prefer' => 'return=representation']
        ))->withoutVerifying()
          ->patch("{$this->url}/{$table}?{$filter}=eq.{$value}", $data);

        return $response->successful() ? ($response->json()[0] ?? null) : null;
    }

    public function delete(string $table, string $filter, mixed $value, bool $useServiceRole = false): bool
    {
        $response = Http::withHeaders($this->headers($useServiceRole))
            ->withoutVerifying()
            ->delete("{$this->url}/{$table}?{$filter}=eq.{$value}");

        return $response->successful();
    }

    public function rpc(string $function, array $params = []): mixed
    {
        $response = Http::withHeaders($this->headers(true))
            ->withoutVerifying()
            ->post("{$this->url}/rpc/{$function}", $params);

        return $response->successful() ? $response->json() : null;
    }
}
