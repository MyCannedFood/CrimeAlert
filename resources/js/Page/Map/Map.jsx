import { useState } from "react";
import {
  Search,
  MapPin,
  Globe2,
  ShieldAlert,
  CalendarDays,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  LocateFixed,
  ChevronDown,
} from "lucide-react";

/* ---------------------------------------------------------------------
   Design tokens (exact hex values from the CrimeWatch Indonesia system)
--------------------------------------------------------------------- */
const COLORS = {
  primary: "#2563EB",
  primaryDark: "#1D4ED8",
  primary50: "#EFF6FF",
  text: "#0F172A",
  textSec: "#64748B",
  border: "#E2E8F0",
  safe: "#22C55E",
  moderate: "#FACC15",
  high: "#F97316",
  danger: "#DC2626",
  nodata: "#94A3B8",
};

const STATUS_LABEL = {
  safe: "Aman",
  moderate: "Sedang",
  high: "Tinggi",
  danger: "Bahaya",
  nodata: "Tidak Ada Data",
};

/* ---------------------------------------------------------------------
   Mock area/marker data — positioned as % coordinates over the map image
   so they stay correctly placed at any screen size. Swap MAP_IMAGE_URL
   for a real map tile/screenshot, or drop the whole <img> once a live
   map API (Google Maps / Mapbox / Leaflet) is wired in.
--------------------------------------------------------------------- */
const MAP_IMAGE_URL =
  "https://placehold.co/1600x1000/E9EEF6/94A3B8?font=inter&text=Peta+Indonesia+%28ganti+dengan+Map+API%29";

const AREAS = [
  { key: "sumatra", name: "Sumatera Utara", city: "Medan", status: "moderate", cases: 184, trend: -4, x: 18, y: 30, breaking: false },
  { key: "jakarta", name: "DKI Jakarta", city: "Jakarta", status: "danger", cases: 412, trend: 11, x: 39, y: 63, breaking: true },
  { key: "kalimantan", name: "Kalimantan Timur", city: "Balikpapan", status: "safe", cases: 62, trend: -9, x: 54, y: 40, breaking: false },
  { key: "sulawesi", name: "Sulawesi Selatan", city: "Makassar", status: "high", cases: 231, trend: 6, x: 66, y: 52, breaking: true },
  { key: "bali", name: "Bali", city: "Denpasar", status: "safe", cases: 41, trend: -12, x: 56, y: 72, breaking: false },
  { key: "maluku", name: "Maluku", city: "Ambon", status: "moderate", cases: 57, trend: 2, x: 79, y: 50, breaking: false },
  { key: "papua", name: "Papua", city: "Jayapura", status: "nodata", cases: 0, trend: 0, x: 91, y: 42, breaking: false },
];

const LEGEND = [
  { status: "safe", label: "Aman" },
  { status: "moderate", label: "Sedang" },
  { status: "high", label: "Tinggi" },
  { status: "danger", label: "Bahaya" },
  { status: "nodata", label: "Tidak Ada Data" },
];

/* ---------------------------------------------------------------------
   Small building blocks
--------------------------------------------------------------------- */
function StatusBadge({ status }) {
  const bgMap = { safe: "#F0FDF4", moderate: "#FEFCE8", high: "#FFF7ED", danger: "#FEF2F2", nodata: "#F1F5F9" };
  const fgMap = { safe: "#15803D", moderate: "#A16207", high: "#C2410C", danger: COLORS.danger, nodata: "#475569" };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: bgMap[status], color: fgMap[status] }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: fgMap[status] }} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function FilterSelect({ icon: Icon, defaultValue, options }) {
  return (
    <label className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 shadow-md">
      <Icon className="h-[15px] w-[15px]" style={{ color: COLORS.primary }} />
      <select
        defaultValue={defaultValue}
        className="cursor-pointer appearance-none bg-transparent pr-1 outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </label>
  );
}

/* ---------------------------------------------------------------------
   Area info card content (shared between desktop popover & mobile sheet)
--------------------------------------------------------------------- */
function AreaInfo({ area, onClose, onViewNews }) {
  return (
    <div className="relative">
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-4 w-4" />
      </button>

      <h4 className="pr-8 text-[15px] font-bold text-slate-900">{area.name}</h4>
      <div className="mt-2">
        <StatusBadge status={area.status} />
      </div>

      <div className="mt-3 divide-y divide-slate-200 border-t border-slate-200 text-[12.5px]">
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-500">Kota utama</span>
          <span className="font-bold text-slate-900">{area.city}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-500">Total kasus (30 hari)</span>
          <span className="font-bold text-slate-900">{area.cases}</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-500">Tren mingguan</span>
          <span className="font-bold" style={{ color: area.trend > 0 ? COLORS.danger : "#15803D" }}>
            {area.trend > 0 ? "+" : ""}
            {area.trend}%
          </span>
        </div>
      </div>

      <button
        onClick={onViewNews}
        className="mt-4 w-full rounded-lg py-2.5 text-[13.5px] font-semibold text-white shadow-sm transition-colors"
        style={{ background: COLORS.primary }}
        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.primaryDark)}
        onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.primary)}
      >
        Lihat Berita Wilayah Ini
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------
   Map page
--------------------------------------------------------------------- */
export default function MapPage() {
  const [selectedKey, setSelectedKey] = useState(null);
  const [heatmapOn, setHeatmapOn] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const selectedArea = AREAS.find((a) => a.key === selectedKey) || null;

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-100"
      style={{ height: "100dvh", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>

      {/* ============ MAP CANVAS ============
          Placeholder <img> for now — swap the src (or replace this whole
          layer with a live map instance) once the map API is wired in. */}
      <div className="absolute inset-0">
        <img
          src={MAP_IMAGE_URL}
          alt="Peta kriminalitas Indonesia"
          className="h-full w-full object-cover transition-all duration-200"
          style={{
            transform: `scale(${zoom})`,
            filter: heatmapOn ? "none" : "saturate(0.35) brightness(1.05)",
          }}
          draggable={false}
        />

        {/* markers, positioned as % over the image so they track any screen size */}
        {AREAS.map((area) => (
          <button
            key={area.key}
            onClick={() => setSelectedKey(area.key)}
            aria-label={`${area.name} — ${STATUS_LABEL[area.status]}`}
            className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ left: `${area.x}%`, top: `${area.y}%` }}
          >
            {area.breaking && (
              <span
                className="absolute h-4 w-4 animate-ping rounded-full opacity-60"
                style={{ background: COLORS[area.status] }}
              />
            )}
            <span
              className="h-3.5 w-3.5 rounded-full border-2 border-white shadow"
              style={{ background: COLORS[area.status] }}
            />
          </button>
        ))}

        {/* desktop info popover, anchored to the selected marker */}
        {selectedArea && (
          <div
            className="absolute z-20 hidden w-[280px] -translate-x-1/2 rounded-xl bg-white p-4 shadow-2xl md:block"
            style={{ left: `${selectedArea.x}%`, top: `${selectedArea.y}%`, transform: "translate(-50%, calc(-100% - 18px))" }}
          >
            <AreaInfo
              area={selectedArea}
              onClose={() => setSelectedKey(null)}
              onViewNews={() => { /* navigate to news filtered by this area */ }}
            />
            <span className="absolute left-1/2 top-full h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white" />
          </div>
        )}
      </div>

      {/* ============ DESKTOP FLOATING TOOLBAR (search + filters) ============ */}
      <div className="absolute left-4 right-4 top-4 z-30 hidden flex-wrap items-center gap-2.5 md:flex">
        <div className="flex min-w-[220px] max-w-[360px] flex-1 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-lg">
          <Search className="h-[18px] w-[18px] text-slate-400" />
          <input
            type="text"
            placeholder="Cari provinsi atau kota..."
            className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-slate-400"
          />
        </div>

        <FilterSelect icon={MapPin} defaultValue="Semua Provinsi" options={["Semua Provinsi", "DKI Jakarta", "Jawa Barat", "Sumatera Utara", "Sulawesi Selatan"]} />
        <FilterSelect icon={Globe2} defaultValue="Semua Kota" options={["Semua Kota", "Jakarta Selatan", "Bandung", "Medan"]} />
        <FilterSelect icon={ShieldAlert} defaultValue="Semua Jenis Kejahatan" options={["Semua Jenis Kejahatan", "Pencurian", "Kekerasan", "Narkoba", "Penipuan Online"]} />
        <FilterSelect icon={CalendarDays} defaultValue="30 Hari Terakhir" options={["30 Hari Terakhir", "7 Hari Terakhir", "3 Bulan Terakhir"]} />

        <button
          onClick={() => setHeatmapOn((v) => !v)}
          className="flex shrink-0 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 shadow-lg"
        >
          <span
            className="relative h-[19px] w-[34px] rounded-full transition-colors"
            style={{ background: heatmapOn ? COLORS.primary : "#CBD5E1" }}
          >
            <span
              className="absolute top-[2px] h-[15px] w-[15px] rounded-full bg-white transition-all"
              style={{ left: heatmapOn ? "17px" : "2px" }}
            />
          </span>
          Heatmap
        </button>
      </div>

      {/* ============ MOBILE TOP BAR (search + filter button) ============ */}
      <div className="absolute left-3 right-3 top-3 z-30 flex items-center gap-2 md:hidden">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3.5 py-2.5 shadow-lg">
          <Search className="h-[17px] w-[17px] shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="Cari provinsi atau kota..."
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Buka filter"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-lg"
          style={{ color: COLORS.primary }}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* ============ MOBILE FILTER BOTTOM SHEET ============ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 flex items-end md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative z-10 max-h-[85dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Filter Peta</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Tutup filter"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                { icon: MapPin, label: "Provinsi", options: ["Semua Provinsi", "DKI Jakarta", "Jawa Barat", "Sumatera Utara", "Sulawesi Selatan"] },
                { icon: Globe2, label: "Kota", options: ["Semua Kota", "Jakarta Selatan", "Bandung", "Medan"] },
                { icon: ShieldAlert, label: "Jenis Kejahatan", options: ["Semua Jenis Kejahatan", "Pencurian", "Kekerasan", "Narkoba", "Penipuan Online"] },
                { icon: CalendarDays, label: "Rentang Tanggal", options: ["30 Hari Terakhir", "7 Hari Terakhir", "3 Bulan Terakhir"] },
              ].map(({ icon: Icon, label, options }) => (
                <div key={label}>
                  <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
                  <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                    <select defaultValue={options[0]} className="w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none">
                      {options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}

              <button
                onClick={() => setHeatmapOn((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3.5 py-3"
              >
                <span className="text-[14px] font-medium text-slate-900">Tampilkan Heatmap</span>
                <span
                  className="relative h-[20px] w-[36px] rounded-full transition-colors"
                  style={{ background: heatmapOn ? COLORS.primary : "#CBD5E1" }}
                >
                  <span
                    className="absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white transition-all"
                    style={{ left: heatmapOn ? "18px" : "2px" }}
                  />
                </span>
              </button>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-5 w-full rounded-lg py-3 text-[14px] font-semibold text-white shadow-sm"
              style={{ background: COLORS.primary }}
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}

      {/* ============ LEGEND — bottom-left ============ */}
      <div className="absolute bottom-3 left-3 z-20 max-w-[calc(100vw-5.5rem)] overflow-x-auto rounded-xl bg-white px-3.5 py-2.5 shadow-lg md:bottom-4 md:left-4 md:max-w-none">
        <div className="flex items-center gap-3 whitespace-nowrap md:gap-4">
          {LEGEND.map((l) => (
            <span key={l.status} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-500">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: COLORS[l.status] }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* ============ ZOOM (desktop only) + LOCATE controls — bottom-right ============ */}
      <div className="absolute bottom-3 right-3 z-20 flex flex-col items-end gap-2.5 md:bottom-4 md:right-4">
        <button
          aria-label="Lokasi saya"
          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg"
          style={{ color: COLORS.primary }}
        >
          <LocateFixed className="h-[18px] w-[18px]" />
        </button>
        <div className="hidden flex-col overflow-hidden rounded-lg bg-white shadow-lg md:flex">
          <button
            onClick={() => setZoom((z) => Math.min(1.5, +(z + 0.15).toFixed(2)))}
            aria-label="Perbesar"
            className="flex h-10 w-10 items-center justify-center border-b border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))}
            aria-label="Perkecil"
            className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-600"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ============ MOBILE INFO BOTTOM SHEET (selected area) ============ */}
      {selectedArea && (
        <div className="fixed inset-x-0 bottom-0 z-40 md:hidden">
          <div className="rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
            <AreaInfo
              area={selectedArea}
              onClose={() => setSelectedKey(null)}
              onViewNews={() => { /* navigate to news filtered by this area */ }}
            />
          </div>
        </div>
      )}
    </div>
  );
}