import React, { useState, useEffect } from 'react';
import { 
    Plus, 
    Search, 
    Flame, 
    Sparkles, 
    Globe2,
    ShieldAlert,
    MessageSquareDashed,
    LogIn 
} from 'lucide-react';
import Dropdown from '../../Components/Dropdown';
import FloatingActionButton from '../../Components/FloatingActionButton';
import Footer from '../../Components/Footer';
import ReportCard from './ReportCard';
import CreateReportModal from './CreateReportModal';
import { api } from '../../utils/api';
import { supabase } from '../../utils/supabase';

export default function Report() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [sort, setSort] = useState('new');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [authAlert, setAuthAlert] = useState('');

    useEffect(() => {
        if (!supabase) return;
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const { data: authData } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => authData?.subscription.unsubscribe();
    }, []);

    const requireAuth = () => {
        if (!supabase) {
            setAuthAlert('Autentikasi tidak tersedia saat ini.');
            return false;
        }
        if (!user) {
            setAuthAlert('Silakan masuk terlebih dahulu untuk membuat laporan.');
            return false;
        }
        return true;
    };

    const openCreateModal = () => {
        setAuthAlert('');
        if (requireAuth()) {
            setIsModalOpen(true);
        }
    };

    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await api.reports.list({
                sort,
                province: selectedProvince,
                search: searchQuery,
            });
            setReports(data || []);
        } catch {
            setReports([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, [sort, selectedProvince]);

    const handleCreateReport = async (newReportData) => {
        try {
            // Payload minimal yang paling aman untuk insert.
            // Hindari field yang sering beda nama/constraint dengan schema Supabase.
            const payload = {
                title: newReportData?.title,
                description: newReportData?.description,
                category: newReportData?.category ?? null,
                province: newReportData?.province ?? null,
                city: newReportData?.city ?? null,
                latitude: newReportData?.latitude ?? null,
                longitude: newReportData?.longitude ?? null,
                username: newReportData?.username ?? 'Anonim',
                image_url: newReportData?.image_url ?? null,
            };

            const created = await api.reports.create(payload);
            if (created) {
                setReports((prev) => [created, ...prev]);
            } else {
                setAuthAlert('Gagal menambahkan laporan. (Respon kosong)');
            }
        } catch (err) {
            console.error('Create report failed:', err);
            setAuthAlert(err?.message || 'Gagal menambahkan laporan. Coba lagi.');
        }
    };

    const handleDeleteReport = async (id) => {
        const confirmed = confirm('Apakah Anda yakin ingin menghapus laporan ini? Tindakan ini tidak dapat dibatalkan.');
        if (!confirmed) return;
        try {
            const success = await api.reports.destroy(id);
            if (success) {
                setReports((prev) => prev.filter((r) => r.id !== id));
            } else {
                setAuthAlert('Gagal menghapus laporan. Coba lagi.');
            }
        } catch (err) {
            console.error('Delete report failed:', err);
            setAuthAlert(err?.message || 'Gagal menghapus laporan.');
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
                        <Dropdown
                            icon={Globe2}
                            value={selectedProvince || 'Semua Provinsi'}
                            onChange={(v) => setSelectedProvince(v === 'Semua Provinsi' ? '' : v)}
                            options={['Semua Provinsi', 'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten']}
                        />

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

                {/* Auth Alert */}
                {authAlert && (
                    <div className="mb-4 flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/80 dark:border-amber-500/20 rounded-xl text-amber-800 dark:text-amber-300 text-sm font-medium transition-colors duration-300">
                        <LogIn className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400" />
                        <span className="flex-1">{authAlert}</span>
                        <button
                            onClick={() => setAuthAlert('')}
                            className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                )}

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
                                onClick={openCreateModal}
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Buat Laporan Pertama
                            </button>
                        </div>
                    )}

                    {!loading && filteredReports.map((report) => (
                        <ReportCard key={report.id} report={report} onVote={handleVote} user={user} onDelete={handleDeleteReport} />
                    ))}
                </div>
            </div>

            {/* Create Report Modal */}
            <CreateReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateReport}
                user={user}
            />

            <FloatingActionButton onClick={openCreateModal} />
            <Footer />
        </div>
    );
}
