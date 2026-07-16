import React from 'react';
import Footer from '../../Components/Footer';

export default function News() {
    const newsItems = [
        { category: "Science" },
        { category: "Innovation" },
        { category: "Industry" },
        { category: "Science" },
        { category: "Science" },
        { category: "Innovation" },
        { category: "Industry" },
        { category: "Science" }
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
                    <div className="text-sm text-gray-800 mb-2">Beranda &gt; Berita</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Berita Kriminal</h1>
                    <p className="text-gray-800 max-w-2xl text-base">
                        Kumpulan berita kriminal terverifikasi dari media terpercaya di seluruh Indonesia.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 py-8 flex-grow">
                
                {/* Search & Filters */}
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    {/* Search Bar */}
                    <div className="flex border border-gray-300 bg-white items-center p-1 w-full md:max-w-md rounded-md">
                        <svg className="w-5 h-5 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" placeholder="Cari Provinsi atau Kota" className="flex-grow outline-none text-sm bg-transparent" />
                        <button className="bg-[#3b82f6] hover:bg-blue-600 text-white px-4 py-1.5 text-sm rounded-md transition-colors">
                            Cari
                        </button>
                    </div>

                    {/* Filter 1 */}
                    <div className="relative">
                        <select className="border border-gray-300 bg-white text-sm py-2 pl-4 pr-10 outline-none appearance-none rounded-md w-full md:w-48 cursor-pointer">
                            <option>Semua Provinsi</option>
                        </select>
                        <svg className="w-4 h-4 text-gray-600 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>

                </div>

                {/* Grid Articles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {newsItems.map((item, index) => (
                        <div key={index} className="border border-gray-200 bg-white flex flex-col rounded-none shadow-sm">
                            <div className="bg-[#9CA3AF] h-56 w-full relative">
                                <div className="absolute bottom-0 left-0 bg-white px-3 py-1.5 text-xs font-semibold text-[#64748B]">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-bold text-[17px] leading-snug mb-6 text-gray-900">
                                    Charge Two Devices at the Same Time With This Magnetic Wireless Charging Dock
                                </h3>
                                <div className="mt-auto flex items-center text-xs text-gray-400 font-medium space-x-4">
                                    <span>Floyd Miles</span>
                                    <span>3 Days Ago</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center space-x-2">
                    <button className="text-gray-300 p-2 cursor-not-allowed">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button className="bg-[#0ea5e9] text-white w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm">1</button>
                    <button className="text-gray-500 hover:bg-gray-100 w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm transition-colors">2</button>
                    <button className="text-gray-500 hover:bg-gray-100 w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm transition-colors">3</button>
                    <button className="text-gray-500 hover:bg-gray-100 w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm transition-colors">4</button>
                    <button className="text-gray-500 hover:bg-gray-100 w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm transition-colors">5</button>
                    <button className="text-black hover:text-gray-700 p-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}