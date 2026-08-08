# 🚨 CrimeAlert Indonesia

**CrimeAlert Indonesia** is a community-driven crime monitoring and news aggregation platform for Indonesia. It gathers crime-related news from trusted media outlets (Sindonews, CNN Indonesia, Detik.com), verifies them, and presents them in a transparent and easy-to-understand way — complete with an interactive crime map, heatmap, statistics, and community reports.

## ✨ Features

- **Crime News Aggregation** — Automated collection and verification of crime news from trusted Indonesian media sources via a FastAPI scraper service.
- **Interactive Map** — Leaflet-based crime map with cluster markers and a crime heatmap layer.
- **Community Reports** — Users can create, read, update, and delete crime reports, complete with images and location data.
- **Comments** — Community discussions on each report.
- **Statistics** — Crime statistics and trends.
- **SOS & Emergency** — Quick-access SOS button and emergency contacts.
- **Dark Mode** — Full dark mode support.

## 🛠 Tech Stack

| Layer       | Technology                                        |
| ----------- | ------------------------------------------------- |
| Backend     | [Laravel 13](https://laravel.com) (PHP 8.3+)      |
| Frontend    | [React 19](https://react.dev) + Vite + Tailwind 4 |
| Map         | Leaflet + react-leaflet + leaflet.heat            |
| Auth/DB     | Supabase                                          |
| News Scraper| FastAPI (proxied via Laravel API)                 |

## 📋 Requirements

- PHP 8.3+
- Composer
- Node.js + npm / pnpm
- Docker (optional, for Laravel Sail)

## 🚀 Getting Started

```bash
# 1. Install PHP dependencies
composer install

# 2. Configure environment
cp .env.example .env
php artisan key:generate

# 3. Install JS dependencies
npm install

# 4. Set up your database and Supabase credentials in .env
#    (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, etc.)

# 5. Run database migrations
php artisan migrate

# 6. Build frontend assets
npm run build

# 7. Serve the app
php artisan serve
```

For development with hot reload, run:

```bash
composer dev
```

### News Scraper Service

News data is fetched from a FastAPI scraper. Set the service URL in your environment:

```
NEWS_SCRAPER_URL=http://localhost:10000
```

The Laravel API proxies requests to this service under `/api/*`.

## 📡 API

Community report endpoints (see `routes/api.php`):

| Method   | Endpoint                          | Description              |
| -------- | --------------------------------- | ------------------------ |
| GET      | `/api/community-reports`          | List reports             |
| GET      | `/api/community-reports/{id}`     | Show a report            |
| POST     | `/api/community-reports`          | Create a report *        |
| PATCH    | `/api/community-reports/{id}`     | Update a report *        |
| DELETE   | `/api/community-reports/{id}`     | Delete a report *        |
| POST     | `/api/images`                     | Upload a report image    |
| GET      | `/api/community-reports/{id}/comments` | List comments        |
| POST     | `/api/community-reports/{id}/comments` | Add a comment *      |

\* Requires Supabase authentication.

## 🧪 Testing

```bash
composer test
```

## 📁 Project Structure

```
app/                  # Laravel application code
  Http/Controllers/   # API controllers
  Models/             # Eloquent models
resources/js/         # React frontend
  Components/         # Reusable UI components
  Page/               # Route pages (Home, Map, News, Report, ...)
  utils/              # Helpers (supabase, api, image, status)
routes/               # Route definitions
database/             # Migrations & seeders
```

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## ⚖️ License

This project is open-sourced software licensed under the [MIT license](LICENSE).
