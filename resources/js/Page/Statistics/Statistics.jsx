import React from 'react';
import MiniMap from '../../Components/Map/MiniMap';
import Footer from '../../Components/Footer';

export default function Statistics() {
    const summaryData = [
        { title: "Total Kasus Bulan Ini", value: "8,492", trend: "+5.21% dari bulan lalu", isPositive: false },
        { title: "Kasus Terselesaikan", value: "6,115", trend: "+72% tingkat penyelesaian", isPositive: true },
        { title: "Wilayah Berisiko Tinggi", value: "7", trend: "+2 wilayah baru", isPositive: false },
        { title: "Rata-rata Kasus Harian", value: "2,74", trend: "+1.4% dari minggu lalu", isPositive: true },
    ];

    // Data tren bulanan Jan-Des - ganti dengan data asli dari API/backend
    const monthlyTrend = [
        { month: "Jan", value: 7200 },
        { month: "Feb", value: 6800 },
        { month: "Mar", value: 7900 },
        { month: "Apr", value: 8100 },
        { month: "May", value: 7600 },
        { month: "Jun", value: 8300 },
        { month: "Jul", value: 8492 },
        { month: "Aug", value: 8700 },
        { month: "Sep", value: 8300 },
        { month: "Oct", value: 7900 },
        { month: "Nov", value: 8600 },
        { month: "Dec", value: 9100 },
    ];

    const crimeCategories = [
        { name: "Theft", percent: "28%", color: "bg-[#3b82f6]" },
        { name: "Fraud", percent: "17%", color: "bg-[#f97316]" },
        { name: "Violence", percent: "15%", color: "bg-[#dc2626]" },
        { name: "Drugs", percent: "11%", color: "bg-[#8b5cf6]" },
        { name: "Cybercrime", percent: "9%", color: "bg-[#14b8a6]" },
        { name: "Traffic", percent: "9%", color: "bg-[#facc15]" },
        { name: "Property", percent: "7%", color: "bg-[#22c55e]" },
        { name: "Homicide", percent: "4%", color: "bg-[#6b21a8]" },
    ];

    const provinces = [
        { name: "1. DKI Jakarta", value: 90, color: "bg-[#dc2626]" },
        { name: "2. Jawa Barat", value: 85, color: "bg-[#dc2626]" },
        { name: "3. Jawa Timur", value: 75, color: "bg-[#dc2626]" },
        { name: "4. Jawa Tengah", value: 65, color: "bg-[#f97316]" },
        { name: "5. Sumatera Utara", value: 60, color: "bg-[#f97316]" },
        { name: "6. Banten", value: 55, color: "bg-[#f97316]" },
        { name: "7. Sumatera Selatan", value: 50, color: "bg-[#f97316]" },
        { name: "8. Riau", value: 45, color: "bg-[#f97316]" },
        { name: "9. Sulawesi Selatan", value: 35, color: "bg-[#facc15]" },
        { name: "10. Lampung", value: 30, color: "bg-[#facc15]" },
    ];

    // ---- Perhitungan untuk Line Chart (Monthly Crime Trend) ----
    const chartValues = monthlyTrend.map((d) => d.value);
    const rawMin = Math.min(...chartValues);
    const rawMax = Math.max(...chartValues);
    const padding = (rawMax - rawMin) * 0.15 || rawMax * 0.1;
    const scaleMin = Math.max(0, Math.floor((rawMin - padding) / 100) * 100);
    const scaleMax = Math.ceil((rawMax + padding) / 100) * 100;

    // Layout SVG
    const SVG_W = 1000;
    const SVG_H = 300;
    const LEFT_PAD = 55;
    const RIGHT_PAD = 20;
    const TOP_PAD = 20;
    const BOTTOM_PAD = 40;
    const chartW = SVG_W - LEFT_PAD - RIGHT_PAD;
    const chartH = SVG_H - TOP_PAD - BOTTOM_PAD;

    const getX = (i) => LEFT_PAD + (i / (monthlyTrend.length - 1)) * chartW;
    const getY = (value) =>
        TOP_PAD + chartH - ((value - scaleMin) / (scaleMax - scaleMin)) * chartH;

    const points = monthlyTrend.map((d, i) => ({
        ...d,
        x: getX(i),
        y: getY(d.value),
    }));

    // Segmen antar titik, warna berdasarkan naik/turun
    const segments = points.slice(1).map((p, i) => {
        const prev = points[i];
        const isIncrease = p.value > prev.value;
        return {
            x1: prev.x,
            y1: prev.y,
            x2: p.x,
            y2: p.y,
            color: isIncrease ? '#dc2626' : '#22c55e',
        };
    });

    // Area (fill) di bawah garis
    const areaPath =
        `M ${points[0].x},${TOP_PAD + chartH} ` +
        points.map((p) => `L ${p.x},${p.y}`).join(' ') +
        ` L ${points[points.length - 1].x},${TOP_PAD + chartH} Z`;

    // Ticks sumbu Y (4 garis bantu)
    const yTicksCount = 4;
    const yTicks = Array.from({ length: yTicksCount + 1 }, (_, i) => {
        const value = scaleMin + ((scaleMax - scaleMin) / yTicksCount) * i;
        return { value, y: getY(value) };
    });

    const formatValue = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1).replace('.0', '')}K` : v);

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col">
            {/* Header Section */}
            <div className="relative overflow-hidden pt-16 pb-12 px-6 md:px-12 border-b border-gray-200" style={{ background: 'linear-gradient(135deg, #EAF0FE 0%, #DCE6FB 100%)' }}>
                <div
                    style={{
                        position: 'absolute',
                        inset: '0 auto auto -3rem',
                        width: '280px',
                        height: '280px',
                        background: 'rgba(255,255,255,0.28)',
                        filter: 'blur(20px)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        inset: 'auto -2rem 0 auto',
                        width: '220px',
                        height: '220px',
                        background: 'rgba(37, 99, 235, 0.12)',
                        filter: 'blur(18px)',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                    }}
                />
                <div className="relative max-w-[1400px] mx-auto">
                    <div className="text-sm text-gray-800 mb-2">Beranda &gt; Statistik</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Statistik Kriminalitas</h1>
                    <p className="text-gray-800 max-w-2xl text-base">
                        Analisis tren, distribusi kategori, dan wilayah paling rawan berdasarkan data yang terverifikasi.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-8 flex-grow space-y-6">

                {/* 1. Summary Cards (Row Layout) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {summaryData.map((item, index) => (
                        <div key={index} className="bg-white border border-gray-200 p-6 rounded-none shadow-sm flex flex-col justify-between">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{item.title}</h3>
                            <div className="text-3xl font-bold text-gray-900 mb-3">{item.value}</div>
                            <div className={`flex items-center text-xs font-medium ${item.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                {item.trend}
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Charts Section (Row Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Line Chart Area - merah (naik) / hijau (turun) */}
                    <div className="col-span-1 lg:col-span-2 bg-white border border-gray-200 p-6 rounded-none shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">Monthly Crime Trend</h3>
                                <p className="text-xs text-gray-500">Jumlah kasus per bulan (Jan - Des)</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center text-gray-600">
                                    <span className="w-3 h-[3px] bg-[#dc2626] mr-1.5"></span>
                                    Naik
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <span className="w-3 h-[3px] bg-[#22c55e] mr-1.5"></span>
                                    Turun
                                </div>
                            </div>
                        </div>

                        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-72" preserveAspectRatio="none">
                            {/* Grid horizontal + label sumbu Y */}
                            {yTicks.map((tick, i) => (
                                <g key={i}>
                                    <line
                                        x1={LEFT_PAD}
                                        y1={tick.y}
                                        x2={SVG_W - RIGHT_PAD}
                                        y2={tick.y}
                                        stroke="#e5e7eb"
                                        strokeWidth="1"
                                        strokeDasharray={i === yTicksCount ? '0' : '4 4'}
                                    />
                                    <text
                                        x={LEFT_PAD - 10}
                                        y={tick.y + 4}
                                        textAnchor="end"
                                        fontSize="11"
                                        fill="#94a3b8"
                                    >
                                        {formatValue(tick.value)}
                                    </text>
                                </g>
                            ))}

                            {/* Area fill di bawah garis */}
                            <path d={areaPath} fill="#3b82f6" opacity="0.06" />

                            {/* Segmen garis berwarna sesuai tren */}
                            {segments.map((seg, i) => (
                                <line
                                    key={i}
                                    x1={seg.x1}
                                    y1={seg.y1}
                                    x2={seg.x2}
                                    y2={seg.y2}
                                    stroke={seg.color}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                />
                            ))}

                            {/* Titik + label bulan + tooltip */}
                            {points.map((p, i) => {
                                const dotColor =
                                    i === 0
                                        ? '#94a3b8'
                                        : p.value > points[i - 1].value
                                        ? '#dc2626'
                                        : '#22c55e';
                                return (
                                    <g key={i}>
                                        <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke={dotColor} strokeWidth="2.5">
                                            <title>{`${p.month}: ${p.value.toLocaleString('id-ID')} kasus`}</title>
                                        </circle>
                                        <text
                                            x={p.x}
                                            y={SVG_H - 12}
                                            textAnchor="middle"
                                            fontSize="11"
                                            fill="#64748b"
                                            fontWeight="500"
                                        >
                                            {p.month}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    {/* Donut Chart Area */}
                    <div className="col-span-1 bg-white border border-gray-200 p-6 rounded-none shadow-sm">
                        <h3 className="text-sm font-bold text-gray-900 mb-1">Crime Categories</h3>
                        <p className="text-xs text-gray-500 mb-6">Distribution by type</p>

                        <div className="flex flex-row lg:flex-col xl:flex-row items-center justify-between gap-6">
                            {/* CSS Donut Graphic */}
                            <div className="relative w-32 h-32 flex-shrink-0 rounded-full"
                                 style={{ background: 'conic-gradient(#3b82f6 0% 28%, #f97316 28% 45%, #dc2626 45% 60%, #8b5cf6 60% 71%, #14b8a6 71% 80%, #facc15 80% 89%, #22c55e 89% 96%, #6b21a8 96% 100%)' }}>
                                <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                                    <span className="text-lg font-bold text-gray-900">6540</span>
                                    <span className="text-[10px] text-gray-500 uppercase">Total</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex-grow w-full">
                                {crimeCategories.map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between mb-1.5 text-xs">
                                        <div className="flex items-center text-gray-600 font-medium">
                                            <span className={`w-3 h-3 ${cat.color} mr-2 rounded-sm`}></span>
                                            {cat.name}
                                        </div>
                                        <span className="font-bold text-gray-900">{cat.percent}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Section (Row Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">

                    {/* Top Provinces Bar Chart */}
                    <div className="bg-white border border-gray-200 p-6 rounded-none shadow-sm flex flex-col">
                        <div className="flex items-center mb-1">
                            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full mr-2">★</span>
                            <h3 className="text-sm font-bold text-gray-900">Top 10 Most Active Provinces</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-6">Ranked by crime index</p>

                        <div className="flex-grow space-y-4">
                            {provinces.map((prov, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="text-xs font-bold text-gray-800 mb-1">{prov.name}</span>
                                    <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                                        <div className={`${prov.color} h-full rounded-full`} style={{ width: `${prov.value}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center space-x-4 mt-8 text-[11px] font-medium text-gray-600">
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#22c55e] mr-1"></span> Aman</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#facc15] mr-1"></span> Sedang</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#f97316] mr-1"></span> Tinggi</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#dc2626] mr-1"></span> Bahaya</div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="bg-white border border-gray-200 p-6 rounded-none shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center mb-1">
                                    <svg className="w-4 h-4 text-blue-600 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                    <h3 className="text-sm font-bold text-gray-900">National Heatmap</h3>
                                </div>
                                <p className="text-xs text-gray-500">Ranked by crime index</p>
                            </div>
                            <a href="/map" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                Lihat Peta Lengkap →
                            </a>
                        </div>

                        {/* Map Visual Component */}
                        <div className="flex-grow w-full border border-gray-100 rounded-sm bg-white overflow-hidden min-h-[300px]">
                            <MiniMap height="300px" showHeatmap={true} interactive={false} />
                        </div>

                        {/* Legend */}
                        <div className="flex items-center space-x-4 mt-6 text-[11px] font-medium text-gray-600">
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#22c55e] mr-1"></span> Aman</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#facc15] mr-1"></span> Sedang</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#f97316] mr-1"></span> Tinggi</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#dc2626] mr-1"></span> Bahaya</div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}