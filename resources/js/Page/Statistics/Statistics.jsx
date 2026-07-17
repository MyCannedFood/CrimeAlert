import React, { useState, useEffect, useRef, useCallback } from 'react';
import MiniMap from '../../Components/Map/MiniMap';
import Footer from '../../Components/Footer';
import { api } from '../../utils/api';

const SEVERITY_COLORS = {
    danger: 'bg-[#dc2626]',
    high: 'bg-[#f97316]',
    moderate: 'bg-[#facc15]',
    safe: 'bg-[#22c55e]',
};

const SEVERITY_ORDER = { safe: 0, moderate: 1, high: 2, danger: 3 };

const CATEGORY_COLORS = [
    '#3b82f6', '#f97316', '#dc2626', '#8b5cf6',
    '#14b8a6', '#facc15', '#22c55e', '#6b21a8',
    '#ec4899', '#6366f1', '#84cc16', '#06b6d4',
];

function monthLabel(monthStr) {
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const parts = monthStr.split('-');
    if (parts.length === 2) {
        return names[parseInt(parts[1], 10) - 1] || monthStr;
    }
    return monthStr;
}

export default function Statistics() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [trend, setTrend] = useState([]);

    // Carousel State
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        Promise.all([
            api.stats.summary(),
            api.stats.byCategory(),
            api.stats.topActiveProvincesLast30Days(),
            api.stats.trend(),
        ])
            .then(([summaryData, catData, provData, trendData]) => {
                setSummary(summaryData);
                setCategories(catData || []);
                setProvinces(provData || []);
                setTrend(trendData || []);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const summaryData = summary ? [
        { title: "Total Kasus Bulan Ini", value: (summary.total_cases ?? 0).toLocaleString('id-ID'), trend: `${summary.avg_daily_cases ?? 0} kasus/hari`, isPositive: true },
        { title: "Kasus Terselesaikan", value: (summary.resolved_cases ?? 0).toLocaleString('id-ID'), trend: `${summary.total_cases > 0 ? Math.round((summary.resolved_cases / summary.total_cases) * 100) : 0}% tingkat penyelesaian`, isPositive: true },
        { title: "Wilayah Berisiko Tinggi", value: (summary.high_risk_regions ?? 0).toLocaleString('id-ID'), trend: 'perlu perhatian', isPositive: false },
        { title: "Rata-rata Kasus Harian", value: (summary.avg_daily_cases ?? 0).toLocaleString('id-ID'), trend: 'rata-rata harian', isPositive: true },
    ] : [];

    // Handle manual scrolling to update pagination dots
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const scrollPosition = scrollRef.current.scrollLeft;
        const width = scrollRef.current.clientWidth;
        // Calculate the current active index based on scroll position
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    }, []);

    // Handle dot click
    const scrollToIndex = (index) => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
        setActiveIndex(index);
    };

    // Auto-play interval
    useEffect(() => {
        if (loading || !summaryData.length || isPaused) return;
        
        const interval = setInterval(() => {
            if (scrollRef.current) {
                const isMobile = window.innerWidth < 640; // sm breakpoint
                if (!isMobile) return; // Don't auto-scroll on desktop grid

                const nextIndex = (activeIndex + 1) % summaryData.length;
                const width = scrollRef.current.clientWidth;
                
                scrollRef.current.scrollTo({
                    left: width * nextIndex,
                    behavior: 'smooth'
                });
                // State is updated by the onScroll event handler automatically
            }
        }, 3500);

        return () => clearInterval(interval);
    }, [loading, summaryData.length, isPaused, activeIndex]);

    const monthlyTrend = trend.length > 0 ? trend : [];
    const crimeCategories = categories.map((c, i) => ({
        name: c.name,
        percent: `${c.percent}%`,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        total: c.total,
    }));

    const TOP_COLOR = {
        sedang: 'bg-[#facc15]', // 0-39
        tinggi: 'bg-[#f97316]', // 40-69
        bahaya: 'bg-[#dc2626]', // 70-100
    };

    const provinceItems = provinces.map((p, i) => ({
        name: `${i + 1}. ${p.province}`,
        value: p.total,
    }));

    const totalAllCases = provinceItems.reduce((sum, item) => sum + item.value, 0);

    const getRiskCategory = (pct) => {
        if (pct >= 15) return 'bahaya';
        if (pct >= 5) return 'tinggi';
        return 'sedang';
    };

    const provinceItemsWithScore = provinceItems.map((item) => {
        const pct = totalAllCases > 0 ? (item.value / totalAllCases) * 100 : 0;
        const category = getRiskCategory(pct);
        return {
            ...item,
            score: Math.round(pct * 10) / 10,
            color: TOP_COLOR[category],
        };
    });

    // Chart dimensions & logic
    const chartValues = monthlyTrend.map((d) => d.incidents);
    const rawMin = chartValues.length ? Math.min(...chartValues) : 0;
    const rawMax = chartValues.length ? Math.max(...chartValues) : 100;
    const padding = (rawMax - rawMin) * 0.15 || rawMax * 0.1;
    const scaleMin = Math.max(0, Math.floor((rawMin - padding) / 100) * 100);
    const scaleMax = Math.ceil((rawMax + padding) / 100) * 100;

    const SVG_W = 1000;
    const SVG_H = 300;
    const LEFT_PAD = 55;
    const RIGHT_PAD = 20;
    const TOP_PAD = 20;
    const BOTTOM_PAD = 40;
    const chartW = SVG_W - LEFT_PAD - RIGHT_PAD;
    const chartH = SVG_H - TOP_PAD - BOTTOM_PAD;

    const getX = (i) => LEFT_PAD + (monthlyTrend.length > 1 ? (i / (monthlyTrend.length - 1)) : 0.5) * chartW;
    const getY = (value) => TOP_PAD + chartH - ((value - scaleMin) / (scaleMax - scaleMin)) * chartH;

    const points = monthlyTrend.map((d, i) => ({
        ...d,
        x: getX(i),
        y: getY(d.incidents),
    }));

    const segments = points.slice(1).map((p, i) => {
        const prev = points[i];
        const isIncrease = p.incidents > prev.incidents;
        return {
            x1: prev.x, y1: prev.y, x2: p.x, y2: p.y,
            color: isIncrease ? '#dc2626' : '#22c55e',
        };
    });

    const areaPath = points.length > 0
        ? `M ${points[0].x},${TOP_PAD + chartH} ` + points.map((p) => `L ${p.x},${p.y}`).join(' ') + ` L ${points[points.length - 1].x},${TOP_PAD + chartH} Z`
        : '';

    const yTicksCount = 4;
    const yTicks = Array.from({ length: yTicksCount + 1 }, (_, i) => {
        const value = scaleMin + ((scaleMax - scaleMin) / yTicksCount) * i;
        return { value, y: getY(value) };
    });

    const formatValue = (v) => (v >= 1000 ? `${(v / 1000).toFixed(1).replace('.0', '')}K` : v);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans flex flex-col">
            <div className="relative overflow-hidden pt-16 pb-12 px-6 md:px-12 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="relative max-w-[1400px] mx-auto">
                    <div className="text-sm text-gray-800 dark:text-slate-300 mb-2 font-medium">Beranda &gt; Statistik</div>
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Statistik Kriminalitas</h1>
                    <p className="text-gray-600 dark:text-slate-400 max-w-2xl text-base">
                        Analisis tren, distribusi kategori, dan wilayah paling rawan berdasarkan data yang terverifikasi.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-12 py-8 flex-grow space-y-6">
                {/* 1. Summary Cards (Mobile Carousel with Dots, Desktop Grid) */}
                <div 
                    className="relative w-full"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => {
                        setTimeout(() => setIsPaused(false), 2000);
                    }}
                >
                    <div 
                        ref={scrollRef} 
                        onScroll={handleScroll}
                        className="flex sm:grid gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none sm:grid-cols-2 lg:grid-cols-4 pb-2 sm:pb-0 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="w-full sm:w-auto shrink-0 snap-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm animate-pulse">
                                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24 mb-4" />
                                    <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-16 mb-3" />
                                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-32" />
                                </div>
                            ))
                        ) : (
                            summaryData.map((item, index) => (
                                <div key={index} className="w-full sm:w-auto shrink-0 snap-center bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm flex flex-col justify-between transition-transform duration-300">
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{item.title}</h3>
                                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{item.value}</div>
                                    <div className={`flex items-center text-xs font-medium ${item.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {item.isPositive 
                                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />}
                                        </svg>
                                        {item.trend}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    {!loading && summaryData.length > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-4 sm:hidden pb-2">
                            {summaryData.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollToIndex(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    className={`transition-all duration-300 rounded-full ${
                                        activeIndex === i 
                                            ? 'w-6 h-2 bg-blue-600 dark:bg-blue-500' 
                                            : 'w-2 h-2 bg-gray-300 dark:bg-slate-600'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. Charts Section (Row Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Line Chart Area */}
                    <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-base font-bold text-gray-900 dark:text-white">Monthly Crime Trend</h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Jumlah kasus per bulan (Jan - Des)</p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <div className="flex items-center text-gray-600 dark:text-slate-300">
                                    <span className="w-3 h-[3px] bg-[#dc2626] mr-1.5 rounded-full"></span>Naik
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-slate-300">
                                    <span className="w-3 h-[3px] bg-[#22c55e] mr-1.5 rounded-full"></span>Turun
                                </div>
                            </div>
                        </div>

                        {monthlyTrend.length > 0 ? (
                            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full h-72" preserveAspectRatio="none">
                                {yTicks.map((tick, i) => (
                                    <g key={i}>
                                        <line x1={LEFT_PAD} y1={tick.y} x2={SVG_W - RIGHT_PAD} y2={tick.y} stroke="#e5e7eb" strokeWidth="1" strokeDasharray={i === yTicksCount ? '0' : '4 4'} className="dark:stroke-slate-700" />
                                        <text x={LEFT_PAD - 10} y={tick.y + 4} textAnchor="end" fontSize="12" fill="#94a3b8" className="dark:fill-slate-500">{formatValue(tick.value)}</text>
                                    </g>
                                ))}
                                <path d={areaPath} fill="#3b82f6" opacity="0.08" className="dark:opacity-10" />
                                {segments.map((seg, i) => (
                                    <line key={i} x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} stroke={seg.color} strokeWidth="2.5" strokeLinecap="round" />
                                ))}
                                {points.map((p, i) => {
                                    const dotColor = i === 0 ? '#94a3b8' : p.incidents > points[i - 1].incidents ? '#dc2626' : '#22c55e';
                                    return (
                                        <g key={i} className="hover:opacity-80 transition-opacity cursor-pointer">
                                            <circle cx={p.x} cy={p.y} r="5" fill="var(--color-bg, #ffffff)" stroke={dotColor} strokeWidth="3" className="dark:fill-slate-800">
                                                <title>{`${monthLabel(p.month)}: ${p.incidents.toLocaleString('id-ID')} kasus`}</title>
                                            </circle>
                                            <text x={p.x} y={SVG_H - 12} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="500" className="dark:fill-slate-400">
                                                {monthLabel(p.month)}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        ) : (
                            <div className="flex items-center justify-center h-72 text-gray-400 dark:text-slate-500 text-sm">
                                {loading ? 'Memuat data tren...' : 'Tidak ada data tren tersedia'}
                            </div>
                        )}
                    </div>

                    {/* Donut Chart Area */}
                    <div className="col-span-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Kategori Kejahatan</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">Distribusi per jenis</p>

                        <div className="flex flex-row lg:flex-col xl:flex-row items-center justify-between gap-6">
                            {crimeCategories.length > 0 ? (() => {
                                const total = crimeCategories.reduce((sum, c) => sum + (c.total || 0), 0);
                                let cumulative = 0;
                                const gradientParts = crimeCategories.map((c, i) => {
                                    const start = cumulative;
                                    cumulative += (c.total / total) * 100;
                                    return `${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} ${start}% ${cumulative}%`;
                                });
                                return (
                                    <div className="relative w-36 h-36 flex-shrink-0 rounded-full shadow-inner" style={{ background: `conic-gradient(${gradientParts.join(', ')})` }}>
                                        <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex flex-col items-center justify-center shadow-sm">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">{total.toLocaleString('id-ID')}</span>
                                            <span className="text-[10px] text-gray-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">Total Kasus</span>
                                        </div>
                                    </div>
                                );
                            })() : (
                                <div className="relative w-36 h-36 flex-shrink-0 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                                    <span className="text-xs text-gray-400 dark:text-slate-500">Tidak ada data</span>
                                </div>
                            )}

                            <div className="flex-grow w-full space-y-2">
                                {crimeCategories.map((cat, i) => (
                                    <div key={i} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center text-gray-600 dark:text-slate-300 font-medium">
                                            <span className="w-3 h-3 mr-2 rounded-full shadow-sm" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}></span>
                                            {cat.name}
                                        </div>
                                        <span className="font-bold text-gray-900 dark:text-white">{cat.percent}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Section (Row Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
                    {/* Top Provinces Bar Chart */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm flex flex-col">
                        <div className="flex items-center mb-1">
                            <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded mr-2 shadow-sm">★</span>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Top Provinsi Teraktif</h3>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-6">Berdasarkan rasio kasus 30 hari terakhir</p>

                        <div className="flex-grow space-y-5">
                            {loading && Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex flex-col animate-pulse">
                                    <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-2" />
                                    <div className="w-full bg-gray-100 dark:bg-slate-700 h-2.5 rounded-full" />
                                </div>
                            ))}
                            {!loading && provinceItemsWithScore.slice(0, 5).map((prov, i) => (
                                <div key={i} className="flex flex-col group">
                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                        <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{prov.name}</span>
                                        <span className="text-xs font-bold text-gray-600 dark:text-slate-400">{Math.round(prov.score)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                                        <div 
                                            className={`${prov.color} h-full rounded-full transition-all duration-1000 ease-out`} 
                                            style={{ width: `${prov.score}%` }} 
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4 mt-8 text-[11px] font-medium text-gray-600 dark:text-slate-400">
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#facc15] mr-1.5 shadow-sm"></span> Sedang</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#f97316] mr-1.5 shadow-sm"></span> Tinggi</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#dc2626] mr-1.5 shadow-sm"></span> Bahaya</div>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-6 rounded-xl shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center mb-1">
                                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-500 mr-1.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white">National Heatmap</h3>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-slate-400">Ranked by crime index</p>
                            </div>
                            <a href="/map" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors flex items-center">
                                Lihat Peta <span className="ml-1">→</span>
                            </a>
                        </div>

                        <div className="flex-grow w-full rounded-lg overflow-hidden min-h-[250px] flex flex-col">
                            <MiniMap showHeatmap={true} interactive={true} className="flex-grow" />
                        </div>

                        <div className="flex items-center flex-wrap gap-4 mt-6 text-[11px] font-medium text-gray-600 dark:text-slate-400">
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#22c55e] mr-1.5 shadow-sm"></span> Aman</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#facc15] mr-1.5 shadow-sm"></span> Sedang</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#f97316] mr-1.5 shadow-sm"></span> Tinggi</div>
                            <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#dc2626] mr-1.5 shadow-sm"></span> Bahaya</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}