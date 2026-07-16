import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
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

import HeatmapLayer from "../../Components/Map/HeatmapLayer";
import MapEventHandler from "../../Components/Map/MapEventHandler";
import CrimeMarkerPopup from "../../Components/Map/CrimeMarkerPopup";
import { MOCK_CRIMES } from "../../data/crimeData";

/* ---------------------------------------------------------------------
   Design tokens & maps
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

const LEGEND = [
  { status: "safe", label: "Aman" },
  { status: "moderate", label: "Sedang" },
  { status: "high", label: "Tinggi" },
  { status: "danger", label: "Bahaya" },
];

/* ---------------------------------------------------------------------
   Custom Leaflet Marker Icon Factory
--------------------------------------------------------------------- */
function createCustomIcon(severity = "moderate", isBreaking = false) {
  const color = COLORS[severity] || COLORS.moderate;
  const pulseHtml = isBreaking
    ? `<span style="position:absolute; width:24px; height:24px; background:${color}; opacity:0.5; border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>`
    : "";

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="position:relative; display:flex; align-items:center; justify-content:center; width:32px; height:32px;">
        ${pulseHtml}
        <div style="background:${color}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.3); z-index:2;"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -12],
  });
}

/* ---------------------------------------------------------------------
   Small UI Helper Components
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

function FilterSelect({ icon: Icon, value, onChange, options }) {
  return (
    <label className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 shadow-md cursor-pointer border border-slate-100 hover:border-slate-300 transition-colors">
      <Icon className="h-[15px] w-[15px]" style={{ color: COLORS.primary }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent pr-1 outline-none font-medium text-slate-800"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </label>
  );
}

function CustomZoomControl() {
  const map = useMap();
  return (
    <div className="hidden flex-col overflow-hidden rounded-lg bg-white shadow-lg border border-slate-100 md:flex z-[1000]">
      <button
        onClick={() => map.zoomIn()}
        aria-label="Perbesar"
        className="flex h-10 w-10 items-center justify-center border-b border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        aria-label="Perkecil"
        className="flex h-10 w-10 items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}

function GeolocationButton() {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolokasi tidak didukung oleh peramban Anda.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration: 1.5 });
      },
      () => {
        setLocating(false);
        alert("Gagal mendapatkan lokasi Anda.");
      }
    );
  };

  return (
    <button
      onClick={handleLocate}
      aria-label="Lokasi saya"
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg border border-slate-100 transition-colors hover:bg-slate-50 z-[1000]"
      style={{ color: COLORS.primary }}
    >
      <LocateFixed className={`h-[18px] w-[18px] ${locating ? "animate-spin" : ""}`} />
    </button>
  );
}

function MapFocusController({ targetLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!targetLocation) return;

    map.flyTo([targetLocation.lat, targetLocation.lng], 13, { duration: 1.2 });
  }, [map, targetLocation]);

  return null;
}

/* ---------------------------------------------------------------------
   Main Map Page Component
--------------------------------------------------------------------- */
export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Semua Provinsi");
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30 Hari Terakhir");
  const [heatmapOn, setHeatmapOn] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [bounds, setBounds] = useState(null);
  const [targetLocation, setTargetLocation] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");

    if (lat && lng) {
      setTargetLocation({
        lat: Number(lat),
        lng: Number(lng),
      });
      return;
    }

    setTargetLocation(null);
  }, [location.search]);

  // Available options derived from data
  const PROVINCE_OPTIONS = ["Semua Provinsi", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatera Utara", "Sulawesi Selatan", "Bali", "Kalimantan Timur"];
  const CITY_OPTIONS = ["Semua Kota", "Jakarta Pusat", "Jakarta Selatan", "Jakarta Barat", "Bandung", "Depok", "Surabaya", "Surakarta", "Medan", "Makassar", "Denpasar", "Balikpapan"];
  const TIME_OPTIONS = ["30 Hari Terakhir", "7 Hari Terakhir", "3 Bulan Terakhir"];

  // Filtered crime dataset based on active filters
  const filteredCrimes = useMemo(() => {
    return MOCK_CRIMES.filter((crime) => {
      // Search text filter
      if (
        searchQuery &&
        !crime.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !crime.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !crime.province.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Province filter
      if (selectedProvince !== "Semua Provinsi" && crime.province !== selectedProvince) {
        return false;
      }
      // City filter
      if (selectedCity !== "Semua Kota" && crime.city !== selectedCity) {
        return false;
      }
      return true;
    });
  }, [searchQuery, selectedProvince, selectedCity, selectedTimeRange]);

  // Convert filtered crimes to heatmap points array [lat, lng, intensity]
  const heatmapPoints = useMemo(() => {
    const intensityMap = { safe: 0.3, moderate: 0.6, high: 0.8, danger: 1.0 };
    return filteredCrimes.map((c) => [c.latitude, c.longitude, intensityMap[c.severity] || 0.5]);
  }, [filteredCrimes]);

  const handleViewNews = (crime) => {
    navigate(`/news?query=${encodeURIComponent(crime.title)}`);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-100"
      style={{ height: "calc(100dvh - 4.5rem)", maxHeight: "calc(100dvh - 4.5rem)", overflow: "hidden", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Dynamic Keyframe Injection for Ping Animation */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

      {/* ============ LEAFLET MAP CONTAINER ============ */}
      <MapContainer
        center={targetLocation ? [targetLocation.lat, targetLocation.lng] : [-2.5489, 118.0149]}
        zoom={targetLocation ? 13 : 5}
        zoomControl={false}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapEventHandler onBoundsChange={setBounds} />
        {targetLocation && <MapFocusController targetLocation={targetLocation} />}

        {/* Heatmap Layer */}
        {heatmapOn && <HeatmapLayer points={heatmapPoints} />}

        {/* Marker Clustering Group */}
        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {filteredCrimes.map((crime) => (
            <Marker
              key={crime.id}
              position={[crime.latitude, crime.longitude]}
              icon={createCustomIcon(crime.severity, crime.severity === "danger")}
            >
              <Popup closeButton={true} className="crime-popup">
                <CrimeMarkerPopup crime={crime} onViewNews={handleViewNews} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {/* Map Embedded Controls (Zoom & Location) */}
        <div className="absolute bottom-3 right-3 z-[1000] flex flex-col items-end gap-2.5 md:bottom-4 md:right-4">
          <GeolocationButton />
          <CustomZoomControl />
        </div>
      </MapContainer>

      {/* ============ DESKTOP FLOATING TOOLBAR ============ */}
      <div className="absolute left-4 right-4 top-4 z-[1000] hidden flex-wrap items-center gap-2.5 md:flex">
        <div className="flex min-w-[220px] max-w-[360px] flex-1 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 shadow-lg border border-slate-100">
          <Search className="h-[18px] w-[18px] text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari provinsi, kota, atau judul..."
            className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-slate-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <FilterSelect
          icon={MapPin}
          value={selectedProvince}
          onChange={setSelectedProvince}
          options={PROVINCE_OPTIONS}
        />
        <FilterSelect
          icon={Globe2}
          value={selectedCity}
          onChange={setSelectedCity}
          options={CITY_OPTIONS}
        />
        <FilterSelect
          icon={CalendarDays}
          value={selectedTimeRange}
          onChange={setSelectedTimeRange}
          options={TIME_OPTIONS}
        />

        <button
          onClick={() => setHeatmapOn((v) => !v)}
          className="flex shrink-0 items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 shadow-lg border border-slate-100 cursor-pointer"
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

      {/* ============ MOBILE TOP BAR ============ */}
      <div className="absolute left-3 right-3 top-3 z-[1000] flex items-center gap-2 md:hidden">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3.5 py-2.5 shadow-lg border border-slate-100">
          <Search className="h-[17px] w-[17px] shrink-0 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari provinsi atau kota..."
            className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Buka filter"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-lg border border-slate-100"
          style={{ color: COLORS.primary }}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* ============ MOBILE FILTER BOTTOM SHEET ============ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end md:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative z-10 max-h-[85dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900">Filter Peta Kriminalitas</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Tutup filter"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wide text-slate-500">Provinsi</span>
                <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                  <select
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                    className="w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none"
                  >
                    {PROVINCE_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wide text-slate-500">Kota</span>
                <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
                  <Globe2 className="h-4 w-4 shrink-0 text-slate-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none"
                  >
                    {CITY_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wide text-slate-500">Rentang Waktu</span>
                <label className="flex items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3">
                  <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                  <select
                    value={selectedTimeRange}
                    onChange={(e) => setSelectedTimeRange(e.target.value)}
                    className="w-full bg-transparent text-[14px] font-medium text-slate-900 outline-none"
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </label>
              </div>

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
              Terapkan Filter ({filteredCrimes.length} Kejadian)
            </button>
          </div>
        </div>
      )}

      {/* ============ LEGEND — bottom-left ============ */}
      <div className="absolute bottom-3 left-3 z-[1000] max-w-[calc(100vw-5.5rem)] overflow-x-auto rounded-xl bg-white px-3.5 py-2.5 shadow-lg border border-slate-100 md:bottom-4 md:left-4 md:max-w-none">
        <div className="flex items-center gap-3 whitespace-nowrap md:gap-4">
          <span className="text-[11.5px] font-bold text-slate-700">Severity:</span>
          {LEGEND.map((l) => (
            <span key={l.status} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[l.status] }} />
              {l.label}
            </span>
          ))}
          <span className="text-[11px] text-slate-400 border-l border-slate-200 pl-3">
            {filteredCrimes.length} Kejadian Ditemukan
          </span>
        </div>
      </div>
    </div>
  );
}