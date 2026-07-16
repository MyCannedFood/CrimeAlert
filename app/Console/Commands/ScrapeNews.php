<?php

namespace App\Console\Commands;

use App\Services\SupabaseService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

#[Signature('scrape:news')]
#[Description('Trigger news scraping via FastAPI NewsScraper service and store results in Supabase')]
class ScrapeNews extends Command
{
    public function handle(SupabaseService $supabase)
    {
        $base = rtrim(env('NEWS_SCRAPER_URL', 'http://localhost:10000'), '/');
        $url = $base . '/api/scrape';

        $this->info("Mengirim perintah scraping ke: {$url}");

        try {
            $response = Http::timeout(120)->post($url);

            if (!$response->successful()) {
                $this->error("Gagal: HTTP {$response->status()} - {$response->body()}");
                return Command::FAILURE;
            }

            $articles = $response->json();
            $this->info('Scraping berhasil! ' . count($articles) . ' artikel diterima.');

            $existing = $supabase->select('crime_articles', ['select' => 'id,title']);
            $existingUrls = [];
            foreach ($existing as $e) {
                $key = md5(strtolower(trim($e['title'] ?? '')));
                $existingUrls[$key] = true;
            }

            $saved = 0;
            $skipped = 0;
            foreach ($articles as $article) {
                $title = $article['title'] ?? '';
                $key = md5(strtolower(trim($title)));
                if (isset($existingUrls[$key])) {
                    $skipped++;
                    continue;
                }

                $severity = 'safe';
                $score = $article['relevance_score'] ?? 0;
                if ($score >= 100) $severity = 'danger';
                elseif ($score >= 40) $severity = 'high';
                elseif ($score >= 10) $severity = 'moderate';

                $data = [
                    'title' => $title,
                    'crime_type' => $article['crime_type'] ?? 'Kriminal',
                    'severity' => $severity,
                    'latitude' => $article['latitude'] ?? 0,
                    'longitude' => $article['longitude'] ?? 0,
                    'province' => $article['province'] ?? '',
                    'city' => $article['city'] ?? '',
                    'published' => $article['published'] ?? now()->toDateString(),
                    'source' => 'scraper:' . ($article['source'] ?? 'unknown'),
                    'url' => $article['url'] ?? '',
                    'description' => $article['summary'] ?? '',
                    'summary' => $article['summary'] ?? '',
                    'content' => $article['content'] ?? '',
                    'image_url' => $article['image_url'] ?? '',
                    'relevance_score' => $article['relevance_score'] ?? 0,
                    'status' => 'reported',
                ];

                $result = $supabase->insert('crime_articles', $data, useServiceRole: true);
                if ($result) {
                    $saved++;
                }
            }

            $this->info("{$saved} baru, {$skipped} duplikat (skip) - tersimpan di Supabase.");
            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error("Error: {$e->getMessage()}");
            return Command::FAILURE;
        }
    }
}
