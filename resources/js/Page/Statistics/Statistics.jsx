import React from 'react';

export default function Statistics() {
    const summaryData = [
        { title: "Total Kasus Bulan Ini", value: "8,492", trend: "+5.21% dari bulan lalu", isPositive: false },
        { title: "Kasus Terselesaikan", value: "6,115", trend: "+72% tingkat penyelesaian", isPositive: true },
        { title: "Wilayah Berisiko Tinggi", value: "7", trend: "+2 wilayah baru", isPositive: false },
        { title: "Rata-rata Kasus Harian", value: "2,74", trend: "+1.4% dari minggu lalu", isPositive: true },
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
                    {/* Line Chart Area */}
                    <div className="col-span-1 lg:col-span-2 bg-white border border-gray-200 p-6 rounded-none shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-gray-900">Monthly Crime Trend</h3>
                            <div className="flex items-center text-xs text-gray-500">
                                <span className="w-2 h-2 bg-gray-800 rounded-full mr-2"></span>
                                Incidents
                            </div>
                        </div>
                        {/* Placeholder Line Chart Visual */}
                        <div className="relative w-full h-64 border-l border-b border-gray-100 flex items-end">
                            <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path d="M0,70 Q10,65 20,80 T40,60 T60,30 T80,50 T100,40" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                                <path d="M0,80 Q15,85 25,60 T50,80 T70,55 T90,35 T100,20" fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2" />
                            </svg>
                            {/* Y-Axis Labels */}
                            <div className="absolute left-[-30px] top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 py-2">
                                <span>30K</span>
                                <span>20K</span>
                                <span>10K</span>
                                <span>0</span>
                            </div>
                            {/* X-Axis Labels */}
                            <div className="absolute bottom-[-25px] w-full flex justify-between text-[10px] text-gray-400 px-4">
                                <span>Jan</span>
                                <span>Feb</span>
                                <span>Mar</span>
                                <span>Apr</span>
                                <span>May</span>
                                <span>Jun</span>
                                <span>Jul</span>
                            </div>
                        </div>
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
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                Lihat Peta Lengkap →
                            </a>
                        </div>
                        
                        {/* Map Visual Placeholder */}
                        <div className="flex-grow w-full border border-gray-100 rounded-sm bg-white flex items-center justify-center min-h-[300px] p-4 relative overflow-hidden">
                            {/* Abstract silhouette of Indonesia using simplified shapes/gradients */}
                            <div className="absolute inset-0 opacity-80" 
                                 style={{
                                    backgroundImage: 'radial-gradient(ellipse at 30% 50%, #f97316 0%, transparent 40%), radial-gradient(ellipse at 60% 60%, #facc15 0%, transparent 30%), radial-gradient(ellipse at 80% 55%, #f97316 0%, transparent 20%)'
                                 }}>
                            </div>
                            <span className="text-gray-400 font-medium text-sm z-10 relative bg-white/60 px-2 py-1 rounded">
                                [ Map Visualization Area ]
                            </span>
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
        </div>
    );
}