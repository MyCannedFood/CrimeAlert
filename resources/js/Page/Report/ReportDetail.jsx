import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import {
    ArrowLeft,
    MapPin,
    Tag,
    User,
    Clock,
    AlertCircle,
    ThumbsUp,
    ImageOff
} from 'lucide-react';
import Footer from '../../Components/Footer';
import { api } from '../../utils/api';
import { fetchReportImageUrl } from '../../utils/image';
import CommentSection from './CommentSection';
import { useDarkMode } from '../../utils/DarkModeProvider';
import { REPORT_STATUS } from '../../utils/status';

const locationIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#ef4444" stroke-width="2"/></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function formatTime(dateStr) {
    if (!dateStr) return 'Baru saja';
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function LocationMap({ lat, lng }) {
  const { isDark } = useDarkMode();
  const gmapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="mb-6 space-y-2">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
        <MapPin className="w-3.5 h-3.5 text-red-500" />
        Titik Kejadian
      </p>
      <a
        href={gmapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-52 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
      >
        <MapContainer center={[lat, lng]} zoom={15} className="w-full h-full" scrollWheelZoom={false} dragging={false} zoomControl={false} doubleClickZoom={false} touchZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={isDark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
          <Marker position={[lat, lng]} icon={locationIcon} />
        </MapContainer>
      </a>
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
        </p>
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5" />
          Buka Rute
        </a>
      </div>
    </div>
  );
}

export default function ReportDetail() {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        setLoading(true);
        api.reports.show(id)
            .then((data) => {
                if (data) setReport(data);
                else setError('Laporan tidak ditemukan');
            })
            .catch(() => setError('Gagal memuat detail laporan'))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (report?.image_url) {
            fetchReportImageUrl(report.image_url).then(setImageUrl);
        }
    }, [report?.image_url]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-colors duration-300">
            <div className="py-4 px-6 md:px-12 border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs transition-colors duration-300">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <Link to="/laporan" className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Semua Laporan Warga
                    </Link>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">ID: #{id}</span>
                </div>
            </div>

            <div className="max-w-[900px] mx-auto w-full px-6 md:px-12 py-8 flex-grow">
                {loading && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-8 animate-pulse space-y-4">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                        <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                    </div>
                )}

                {error && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 p-8 rounded-xl text-center space-y-3">
                        <AlertCircle className="w-8 h-8 text-rose-500 dark:text-rose-400 mx-auto" />
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{error}</p>
                        <Link to="/laporan" className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                            Kembali ke daftar laporan
                        </Link>
                    </div>
                )}

                {!loading && report && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 md:p-8 shadow-xs transition-colors duration-300">
                        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 mb-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                                u/{report.username || 'WargaAnonim'}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                {formatTime(report.created_at)}
                            </span>
                            {report.category && (
                                <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium">
                                    <Tag className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                    {report.category}
                                </span>
                            )}
                            {report.province && (
                                <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                    {report.city ? `${report.city}, ` : ''}{report.province}
                                    {report.latitude && report.longitude && (
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-1">
                                            ({Number(report.latitude).toFixed(4)}, {Number(report.longitude).toFixed(4)})
                                        </span>
                                    )}
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                            {report.title}
                        </h1>

                        {imageUrl ? (
                            <div className="relative w-full max-h-96 rounded-xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                                <img
                                    src={imageUrl}
                                    alt={report.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : report.image_url ? (
                            <div className="w-full h-48 rounded-xl mb-6 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <ImageOff className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                            </div>
                        ) : null}

                        {report.latitude && report.longitude && (
                            <LocationMap lat={report.latitude} lng={report.longitude} />
                        )}

                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 whitespace-pre-wrap mb-8 text-sm md:text-base">
                            {report.description}
                        </div>

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 px-3 py-1.5 rounded-lg">
                                <ThumbsUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                Total Vote: {(report.upvotes || 0) - (report.downvotes || 0)}
                            </div>

                            {(() => {
                                const cfg = REPORT_STATUS[report.status];
                                if (!cfg) return null;
                                const Icon = cfg.icon;
                                return (
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${cfg.className}`}>
                                        <Icon className={`w-3.5 h-3.5 ${cfg.iconClass}`} />
                                        {cfg.label}
                                    </span>
                                );
                            })()}
                        </div>

                        <CommentSection reportId={id} />
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
