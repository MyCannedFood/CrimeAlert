import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Flame, 
    Sparkles, 
    Filter, 
    ShieldAlert,
    MessageSquareDashed 
} from 'lucide-react';
import Footer from '../../Components/Footer';
import ReportCard from './ReportCard';
import CreateReportModal from './CreateReportModal';
import { api } from '../../utils/api';

const SAMPLE_REPORTS = [
    {
        id: 'mock-1',
        username: 'BudiPratama',
        title: 'Percobaan Pembegalan Sepeda Motor Malam Hari di Kawasan Tebet',
        description: 'Tadi malam sekitar pukul 23:30 WIB, terjadi percobaan pembegalan di dekat stasiun Tebet. Pelaku mengendarai motor matic tanpa plat nomor dan membawa senjata tajam. Beruntung korban berhasil melarikan diri ke area ramai.',
        category: 'Pencurian / Begal',
        province: 'DKI Jakarta',
        city: 'Jakarta Selatan',
        upvotes: 48,
        downvotes: 2,
        status: 'verified',
        created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
        id: 'mock-2',
        username: 'SitiWargaRungkut',
        title: 'Penipuan Modus Modus Tukar Uang Asing Palsu di Mall Surabaya',
        description: 'Waspada bagi warga Surabaya. Ada kelompok orang tak dikenal menawarkan penukaran valas di parkiran mall dengan iming-iming kurs tinggi, ternyata uang yang diberikan adalah kertas lembaran palsu.',
        category: 'Penipuan / Cybercrime',
        province: 'Jawa Timur',
        city: 'Surabaya',
        upvotes: 29,
        downvotes: 1,
        status: 'verified',
        created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
    {
        id: 'mock-3',
        username: 'WargaBandung',
        title: 'Pencurian Helm Berantai di Parkiran Ruko Dago',
        description: 'Dalam seminggu terakhir sudah terjadi 4 kasus kehilangan helm bermerek di area parkiran ruko daerah Dago. CCTV menangkap pelaku yang sama beraksi sekitar jam makan siang.',
        category: 'Pencurian / Begal',
        province: 'Jawa Barat',
        city: 'Bandung',
        upvotes: 15,
        downvotes: 0,
        status: 'pending',
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
];

export default function Report() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [sort, setSort] = useState('new'); // 'new' | 'top'
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await api.reports.list({
                sort,
                province: selectedProvince,
                search: searchQuery,
            });
            if (data && data.length > 0) {
                setReports(data);
            } else {
                setReports(SAMPLE_REPORTS);
            }
        } catch {
            setReports(SAMPLE_REPORTS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, [sort, selectedProvince]);

    const handleCreateReport = async (newReportData) => {
        try {
            const created = await api.reports.create(newReportData);
            if (created) {
                setReports((prev) => [created, ...prev]);
            } else {
                const mockCreated = { ...newReportData, id: `mock-${Date.now()}` };
                setReports((prev) => [mockCreated, ...prev]);
            }
        } catch {
            const mockCreated = { ...newReportData, id: `mock-${Date.now()}` };
            setReports((prev) => [mockCreated, ...prev]);
        }
    };

    const handleVote = (id, newVote) => {
        const getUserId = () => {
            let uid = localStorage.getItem('crimealert_user_id');
            if (!uid) {
                uid = 'anon_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('crimealert_user_id', uid);
            }
            return uid;
        };

        api.reports.vote(id, getUserId(), newVote).catch(() => {});
    };

    const filteredReports = reports.filter((item) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            item.title?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.city?.toLowerCase().includes(q) ||
            item.province?.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col transition-colors duration-300">
            {/* Header Banner */}
            <div className="bg-white dark:bg-slate-900 pt-12 pb-10 px-6 md:px-12 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            Komunitas Keamanan Warga
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                            Laporan Kejahatan Warga
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-sm md:text-base leading-relaxed">
                            Wadah pengawasan partisipatif warga untuk saling membagikan informasi insiden kejahatan dan kewaspadaan lingkungan secara real-time.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-sm rounded-lg shadow-sm transition-all cursor-pointer border border-transparent"
                    >
                        <Plus className="w-4 h-4" />
                        Buat Laporan
                    </button>
                </div>
            </div>

            {/* Content Body */}
            <div className="max-w-[1100px] mx-auto w-full px-6 md:px-12 py-8 flex-grow">
                {/* Search & Sort Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-300">
                    {/* Search Input */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-slate-50/50 dark:bg-slate-800 flex-grow md:max-w-md focus-within:bg-white dark:focus-within:bg-slate-800 focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors">
                        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 mr-2 shrink-0" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kata kunci, lokasi, atau judul..."
                            className="bg-transparent text-sm outline-none w-full text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    {/* Filter Province & Sort Tabs */}
                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <div className="relative flex items-center">
                            <select
                                value={selectedProvince}
                                onChange={(e) => setSelectedProvince(e.target.value)}
                                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 py-2 pl-3 pr-8 rounded-lg outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 appearance-none transition-colors"
                            >
                                <option value="">Semua Provinsi</option>
                                <option value="DKI Jakarta">DKI Jakarta</option>
                                <option value="Jawa Barat">Jawa Barat</option>
                                <option value="Jawa Tengah">Jawa Tengah</option>
                                <option value="Jawa Timur">Jawa Timur</option>
                                <option value="Banten">Banten</option>
                            </select>
                            <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 pointer-events-none" />
                        </div>

                        <div className="flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium transition-colors">
                            <button
                                onClick={() => setSort('new')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                                    sort === 'new' 
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' 
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <Sparkles className={`w-3.5 h-3.5 ${sort === 'new' ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                                Terbaru
                            </button>
                            <button
                                onClick={() => setSort('top')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                                    sort === 'top' 
                                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs' 
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                }`}
                            >
                                <Flame className={`w-3.5 h-3.5 ${sort === 'top' ? 'text-amber-500 dark:text-amber-400' : ''}`} />
                                Terpopuler
                            </button>
                        </div>
                    </div>
                </div>

                {/* List of Reports */}
                <div className="space-y-3">
                    {loading && Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-6 animate-pulse space-y-3">
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                        </div>
                    ))}

                    {!loading && filteredReports.length === 0 && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-12 text-center text-slate-500 space-y-3 transition-colors duration-300">
                            <MessageSquareDashed className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                            <p className="text-base font-semibold text-slate-800 dark:text-slate-200">Belum ada laporan ditemukan</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                Tidak ada laporan yang sesuai dengan pencarian Anda. Silakan laporkan kejadian baru jika ada insiden di sekitar Anda.
                            </p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Buat Laporan Pertama
                            </button>
                        </div>
                    )}

                    {!loading && filteredReports.map((report) => (
                        <ReportCard key={report.id} report={report} onVote={handleVote} />
                    ))}
                </div>
            </div>

            {/* Create Report Modal */}
            <CreateReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateReport}
            />

            <Footer />
        </div>
    );
}
