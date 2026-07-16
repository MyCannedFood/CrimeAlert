import React from 'react';

const SEVERITY_COLOR = {
  safe: { bg: '#F0FDF4', fg: '#15803D', label: 'Aman' },
  moderate: { bg: '#FEFCE8', fg: '#A16207', label: 'Sedang' },
  high: { bg: '#FFF7ED', fg: '#C2410C', label: 'Tinggi' },
  danger: { bg: '#FEF2F2', fg: '#DC2626', label: 'Bahaya' },
};

export default function CrimeMarkerPopup({ crime, onViewNews }) {
  const severityStyle = SEVERITY_COLOR[crime.severity] || SEVERITY_COLOR.moderate;

  return (
    <div className="p-1 min-w-[220px] max-w-[280px]">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
          {crime.category}
        </span>
        <span
          className="text-[10.5px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: severityStyle.bg, color: severityStyle.fg }}
        >
          {severityStyle.label}
        </span>
      </div>

      <h4 className="text-[14px] font-bold text-slate-900 leading-snug mb-2">
        {crime.title}
      </h4>

      <div className="text-[12px] text-slate-500 space-y-1 mb-3">
        <p>📍 {crime.city}, {crime.province}</p>
        <p>📅 {crime.date}</p>
        {crime.source && <p>📰 Sumber: {crime.source}</p>}
      </div>

      <button
        onClick={() => onViewNews && onViewNews(crime)}
        className="w-full text-center py-1.5 px-3 rounded text-[12.5px] font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Lihat Berita Detail
      </button>
    </div>
  );
}
