import React, { useState, useEffect } from 'react';
import Footer from '../../Components/Footer';
import { api } from '../../utils/api';

function timeAgo(dateStr) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
}

const ITEMS_PER_PAGE = 8;

export default function News() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [activePage, setActivePage] = useState(1);

    useEffect(() => {
        api.crimes.list()
            .then((data) => setItems(data || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false))
    }, []);

    const provinces = [...new Set(items.map((c) => c.province).filter(Boolean))].sort();

    const filtered = items.filter((item) => {
        if (searchQuery && !item.title?.toLowerCase().includes(searchQuery.toLowerCase()) && !item.city?.toLowerCase().includes(searchQuery.toLowerCase()) && !item.province?.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (selectedProvince && item.province !== selectedProvince) {
            return false;
        }
        return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    const startIdx = (activePage - 1) * ITEMS_PER_PAGE;
    const pageItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const PAGINATION_WINDOW = 5;
    const getVisiblePages = (current, total) => {
        const clampedTotal = Math.max(1, total);
        const windowSize = Math.min(PAGINATION_WINDOW, clampedTotal);

        const start = Math.max(
            1,
            Math.min(
                current - Math.floor(windowSize / 2),
                clampedTotal - windowSize + 1
            )
        );
        const end = Math.min(clampedTotal, start + windowSize - 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages(activePage, totalPages);

    const handleSearch = (e) => {
        e.preventDefault();
        setActivePage(1);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 font-sans flex flex-col">
            <div className="relative overflow-hidden pt-16 pb-12 px-6 md:px-12 border-b border-gray-200 dark:border-slate-700" style={{ background: 'linear-gradient(135deg, var(--color-hero-start) 0%, var(--color-hero-end) 100%)' }}>
                <div className="relative max-w-[1400px] mx-auto">
                    <div className="text-sm text-gray-800 dark:text-slate-300 mb-2">Beranda &gt; Berita</div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Berita Kriminal</h1>
                    <p className="text-gray-800 dark:text-slate-300 max-w-2xl text-base">
                        Kumpulan berita kriminal terverifikasi dari media terpercaya di seluruh Indonesia.
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-8 flex-grow">
                <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 items-center p-1 w-full md:max-w-md rounded-md">
                        <svg className="w-5 h-5 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari judul, provinsi, atau kota..."
                            className="flex-grow outline-none text-sm bg-transparent dark:text-slate-200 dark:placeholder:text-slate-500"
                        />
                        <button type="submit" className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-1.5 text-sm rounded-md transition-colors">
                            Cari
                        </button>
                    </div>

                    <div className="relative">
                        <select
                            value={selectedProvince}
                            onChange={(e) => { setSelectedProvince(e.target.value); setActivePage(1); }}
                            className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-200 text-sm py-2 pl-4 pr-10 outline-none appearance-none rounded-md w-full md:w-48 cursor-pointer"
                        >
                            <option value="">Semua Provinsi</option>
                            {provinces.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                        <svg className="w-4 h-4 text-gray-600 dark:text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {loading && Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col rounded-none shadow-sm">
                            <div className="bg-gray-200 dark:bg-slate-700 h-56 w-full animate-pulse" />
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-2 w-3/4" />
                                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse mb-6 w-1/2" />
                                <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse w-1/3 mt-auto" />
                            </div>
                        </div>
                    ))}
                    {!loading && pageItems.length === 0 && (
                        <div className="col-span-full text-center py-16 text-gray-400 dark:text-slate-500">
                            Tidak ada berita ditemukan
                        </div>
                    )}
                    {pageItems.map((item) => (
                        <a
                            key={item.id}
                            href={`/berita/${item.id}`}
                            className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col rounded-none shadow-sm no-underline"
                            style={{ color: 'inherit' }}
                        >
                            <div className="bg-[#9CA3AF] dark:bg-slate-700 h-56 w-full relative">
                                <div className="absolute bottom-0 left-0 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-[#64748B] dark:text-slate-300">
                                    {item.category}
                                </div>
                                {item.image_url ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                ) : null}
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-bold text-[17px] leading-snug mb-6 text-gray-900 dark:text-slate-100">
                                    {item.title}
                                </h3>
                                <div className="mt-auto flex items-center text-xs text-gray-400 dark:text-slate-500 font-medium space-x-4">
                                    <span>{item.source || 'Sumber tidak diketahui'}</span>
                                    <span>{timeAgo(item.date)}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <button
                        onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                        disabled={activePage === 1}
                        className={`p-2 ${activePage === 1 ? 'text-gray-300 dark:text-slate-600 cursor-not-allowed' : 'text-black dark:text-slate-300 hover:text-gray-700 dark:hover:text-slate-400'} transition-colors`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            onClick={() => setActivePage(page)}
                            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm transition-colors ${activePage === page ? 'bg-[#0ea5e9] text-white' : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
                        disabled={activePage === totalPages}
                        className={`p-2 ${activePage === totalPages ? 'text-gray-300 dark:text-slate-600 cursor-not-allowed' : 'text-black dark:text-slate-300 hover:text-gray-700 dark:hover:text-slate-400'} transition-colors`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
                )}
            </div>
            <Footer />
        </div>
    );
}