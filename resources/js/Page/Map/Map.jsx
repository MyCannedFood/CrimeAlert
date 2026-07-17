import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import {
  Search,
  MapPin,
  Globe2,
  CalendarDays,
  SlidersHorizontal,
  X,
  Plus,
  Minus,
  LocateFixed,
} from "lucide-react";

import HeatmapLayer from "../../Components/Map/HeatmapLayer";
import MapEventHandler from "../../Components/Map/MapEventHandler";
import CrimeMarkerPopup from "../../Components/Map/CrimeMarkerPopup";
import Dropdown from "../../Components/Dropdown";
import { api } from "../../utils/api";
import { useDarkMode } from "../../utils/DarkModeProvider";

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
function StatusBadge({ status, isDark }) {
  const bgMap = { safe: "#F0FDF4", moderate: "#FEFCE8", high: "#FFF7ED", danger: "#FEF2F2", nodata: "#F1F5F9" };
  const bgMapDark = { safe: "#052e16", moderate: "#422006", high: "#431407", danger: "#450a0a", nodata: "#1e293b" };
  const fgMap = { safe: "#15803D", moderate: "#A16207", high: "#C2410C", danger: COLORS.danger, nodata: "#475569" };
  const fgMapDark = { safe: "#4ade80", moderate: "#facc15", high: "#fb923c", danger: "#fca5a5", nodata: "#94a3b8" };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold"
      style={{ background: isDark ? (bgMapDark[status] || bgMapDark.nodata) : (bgMap[status] || bgMap.nodata), color: isDark ? (fgMapDark[status] || fgMapDark.nodata) : (fgMap[status] || fgMap.nodata) }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: isDark ? (fgMapDark[status] || fgMapDark.nodata) : (fgMap[status] || fgMap.nodata) }} />
      {STATUS_LABEL[status]}
    </span>
  );
}

function CustomZoomControl() {
  const map = useMap();
  return (
    <div className="hidden flex-col overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 md:flex z-[1000]">
      <button
        onClick={() => map.zoomIn()}
        aria-label="Perbesar"
        className="flex h-10 w-10 items-center justify-center border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
      >
        <Plus className="h-4 w-4" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        aria-label="Perkecil"
        className="flex h-10 w-10 items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-blue-600 transition-colors"
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
      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 z-[1000]"
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
  const { isDark } = useDarkMode();
  const [crimes, setCrimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Semua Provinsi");
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30 Hari Terakhir");
  const [heatmapOn, setHeatmapOn] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [bounds, setBounds] = useState(null);
  const [targetLocation, setTargetLocation] = useState(null);

  useEffect(() => {
    api.crimes.list()
      .then((data) => setCrimes(data || []))
      .catch(() => setCrimes([]))
      .finally(() => setLoading(false))
  }, []);

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

  // Available options derived from actual data
  const PROVINCE_OPTIONS = useMemo(() => {
    const provinces = [...new Set(crimes.map((c) => c.province).filter(Boolean))];
    return ["Semua Provinsi", ...provinces.sort()];
  }, [crimes]);

  const CITY_OPTIONS = useMemo(() => {
    const filtered = selectedProvince !== "Semua Provinsi"
      ? crimes.filter((c) => c.province === selectedProvince)
      : crimes;
    const cities = [...new Set(filtered.map((c) => c.city).filter(Boolean))];
    return ["Semua Kota", ...cities.sort()];
  }, [crimes, selectedProvince]);

  const TIME_OPTIONS = ["30 Hari Terakhir", "7 Hari Terakhir", "3 Bulan Terakhir"];

  // Filtered crime dataset based on active filters
  const filteredCrimes = useMemo(() => {
    return crimes.filter((crime) => {
      if (
        searchQuery &&
        !crime.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !crime.city?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !crime.province?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedProvince !== "Semua Provinsi" && crime.province !== selectedProvince) {
        return false;
      }
      if (selectedCity !== "Semua Kota" && crime.city !== selectedCity) {
        return false;
      }
      if (selectedTimeRange === "7 Hari Terakhir") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (new Date(crime.date) < weekAgo) return false;
      }
      if (selectedTimeRange === "30 Hari Terakhir") {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        if (new Date(crime.date) < monthAgo) return false;
      }
      if (selectedTimeRange === "3 Bulan Terakhir") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        if (new Date(crime.date) < threeMonthsAgo) return false;
      }
      return true;
    });
  }, [crimes, searchQuery, selectedProvince, selectedCity, selectedTimeRange]);

  // Convert filtered crimes to heatmap points array [lat, lng, intensity]
  const heatmapPoints = useMemo(() => {
    const intensityMap = { safe: 0.3, moderate: 0.6, high: 0.8, danger: 1.0 };
    return filteredCrimes.map((c) => [c.latitude, c.longitude, intensityMap[c.severity] || 0.5]);
  }, [filteredCrimes]);

  // Reset city filter if it's no longer valid for the selected province
  useEffect(() => {
    if (!CITY_OPTIONS.includes(selectedCity)) setSelectedCity("Semua Kota");
  }, [CITY_OPTIONS, selectedCity]);

  const handleViewNews = (crime) => {
    navigate(`/berita/${crime.id}`);
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-100 dark:bg-slate-900 font-sans"
      style={{ height: "calc(100dvh - 4.5rem)", maxHeight: "calc(100dvh - 4.5rem)", overflow: "hidden" }}
    >
      {/* Dynamic Keyframe Injection + custom dropdown scrollbar styling */}
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
          url={isDark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />

        <MapEventHandler onBoundsChange={setBounds} />
        {targetLocation && <MapFocusController targetLocation={targetLocation} />}

        {/* Heatmap Layer */}
        {heatmapOn && <HeatmapLayer points={heatmapPoints} />}

        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/60 dark:bg-black/60">
            <div className="flex items-center gap-3 rounded-xl bg-white dark:bg-slate-800 px-6 py-4 shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Memuat data...</span>
            </div>
          </div>
        )}

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
        <div className="flex min-w-[220px] max-w-[360px] flex-1 items-center gap-2.5 rounded-full bg-white dark:bg-slate-800 px-4 py-2.5 shadow-lg border border-slate-100 dark:border-slate-700">
          <Search className="h-[18px] w-[18px] text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari provinsi, kota, atau judul..."
            className="min-w-0 flex-1 bg-transparent dark:text-slate-200 text-[13.5px] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Dropdown
          icon={MapPin}
          value={selectedProvince}
          onChange={setSelectedProvince}
          options={PROVINCE_OPTIONS}
        />
        <Dropdown
          icon={Globe2}
          value={selectedCity}
          onChange={setSelectedCity}
          options={CITY_OPTIONS}
        />
        <Dropdown
          icon={CalendarDays}
          value={selectedTimeRange}
          onChange={setSelectedTimeRange}
          options={TIME_OPTIONS}
        />

        <button
          onClick={() => setHeatmapOn((v) => !v)}
          className="flex shrink-0 items-center gap-2.5 rounded-full bg-white dark:bg-slate-800 px-4 py-2.5 text-[13px] font-semibold text-slate-900 dark:text-slate-100 shadow-lg border border-slate-100 dark:border-slate-700 cursor-pointer"
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
        <div className="flex flex-1 items-center gap-2 rounded-full bg-white dark:bg-slate-800 px-3.5 py-2.5 shadow-lg border border-slate-100 dark:border-slate-700">
          <Search className="h-[17px] w-[17px] shrink-0 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari provinsi atau kota..."
            className="min-w-0 flex-1 bg-transparent dark:text-slate-200 text-[13px] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Buka filter"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700"
          style={{ color: COLORS.primary }}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* ============ MOBILE FILTER BOTTOM SHEET ============ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative z-10 max-h-[85dvh] w-full overflow-y-auto rounded-t-2xl bg-white dark:bg-slate-800 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-slate-900 dark:text-slate-100">Filter Peta Kriminalitas</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Tutup filter"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <Dropdown
                variant="block"
                label="Provinsi"
                icon={MapPin}
                value={selectedProvince}
                onChange={setSelectedProvince}
                options={PROVINCE_OPTIONS}
              />

              <Dropdown
                variant="block"
                label="Kota"
                icon={Globe2}
                value={selectedCity}
                onChange={setSelectedCity}
                options={CITY_OPTIONS}
              />

              <Dropdown
                variant="block"
                label="Rentang Waktu"
                icon={CalendarDays}
                value={selectedTimeRange}
                onChange={setSelectedTimeRange}
                options={TIME_OPTIONS}
              />

              <button
                onClick={() => setHeatmapOn((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-3"
              >
                <span className="text-[14px] font-medium text-slate-900 dark:text-slate-200">Tampilkan Heatmap</span>
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
      <div className="absolute bottom-3 left-3 z-[1000] max-w-[calc(100vw-5.5rem)] overflow-x-auto rounded-xl bg-white dark:bg-slate-800 px-3.5 py-2.5 shadow-lg border border-slate-100 dark:border-slate-700 md:bottom-4 md:left-4 md:max-w-none">
        <div className="flex items-center gap-3 whitespace-nowrap md:gap-4">
          <span className="text-[11.5px] font-bold text-slate-700 dark:text-slate-300">Severity:</span>
          {LEGEND.map((l) => (
            <span key={l.status} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-slate-600 dark:text-slate-400">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: COLORS[l.status] }} />
              {l.label}
            </span>
          ))}
          <span className="text-[11px] text-slate-400 dark:text-slate-500 border-l border-slate-200 dark:border-slate-700 pl-3">
            {filteredCrimes.length} Kejadian Ditemukan
          </span>
        </div>
      </div>
    </div>
  );
}