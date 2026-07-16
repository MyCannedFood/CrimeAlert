import React, { useState, useEffect } from 'react';
import { FileText, X, Send, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '../../utils/api';

const FALLBACK_CATEGORIES = [
    'Pencurian / Begal',
    'Perampokan / Penjarahan',
    'Tindak Kekerasan',
    'Penipuan / Cybercrime',
    'Narkoba / Miras',
    'Tindakan Asusila',
    'Lainnya',
];

const FALLBACK_PROVINCES = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Banten',
    'DI Yogyakarta',
    'Sumatera Utara',
    'Bali',
    'Lainnya',
];

export default function CreateReportModal({ isOpen, onClose, onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [username, setUsername] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
    const [provinces, setProvinces] = useState(FALLBACK_PROVINCES);

    useEffect(() => {
        if (!isOpen) return;
        api.getCategoryOptions().then((cats) => {
            if (cats.length > 0) setCategories(cats);
        });
        api.getProvinceOptions().then((provs) => {
            if (provs.length > 0) setProvinces(provs);
        });
    }, [isOpen]);

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'].includes(file.type)) {
            setError('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Ukuran gambar maksimal 5MB.');
            return;
        }
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            setError('Judul dan deskripsi wajib diisi');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            let imageId = null;
            if (imageFile) {
                imageId = await api.reports.image.upload(imageFile);
                if (!imageId) {
                    setError('Gagal mengunggah gambar');
                    setSubmitting(false);
                    return;
                }
            }

            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                category: category || null,
                province: province || null,
                city: city.trim() || null,
                username: username.trim() || 'WargaAnonim',
                image_url: imageId,
                upvotes: 1,
                downvotes: 0,
                status: 'pending',
                created_at: new Date().toISOString(),
            });

            setTitle('');
            setDescription('');
            setCity('');
            setUsername('');
            setImageFile(null);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
            onClose();
        } catch (err) {
            setError(err.message || 'Gagal mengirim laporan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
        setImageFile(null);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                        Buat Laporan Kejahatan
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs rounded-lg border border-rose-200/80 dark:border-rose-500/20 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Nama Pelapor (Opsional)
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Anonim jika dikosongkan"
                            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Judul Kejadian *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Contoh: Pembegalan sepeda motor di Jl. Sudirman"
                            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Kategori
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 cursor-pointer"
                            >
                                <option value="">Pilih Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                                Provinsi
                            </label>
                            <select
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 cursor-pointer"
                            >
                                <option value="">Pilih Provinsi</option>
                                {provinces.map((prov) => (
                                    <option key={prov} value={prov}>{prov}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Kota / Kabupaten (Opsional)
                        </label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Contoh: Jakarta Selatan"
                            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Gambar Kejadian (Opsional)
                        </label>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer transition-colors text-sm font-medium border border-slate-200/60 dark:border-slate-700/50">
                                <Upload className="w-4 h-4" />
                                {imageFile ? 'Ganti Gambar' : 'Pilih Gambar'}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {imageFile && (
                                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                    {imageFile.name}
                                </span>
                            )}
                        </div>
                        {imagePreview && (
                            <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        URL.revokeObjectURL(imagePreview);
                                        setImagePreview(null);
                                        setImageFile(null);
                                    }}
                                    className="absolute top-1.5 right-1.5 bg-slate-900/60 hover:bg-slate-900/80 text-white p-1 rounded-full transition-colors cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}
                        {!imageFile && (
                            <div className="mt-2 w-full h-20 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                                <ImageIcon className="w-4 h-4" />
                                Maks. 5MB — JPG, PNG, GIF, WebP
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Kronologi Kejadian *
                        </label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Jelaskan detail kronologi, waktu kejadian, dan ciri-ciri pelaku jika ada..."
                            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-lg px-3.5 py-2 text-sm outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                        >
                            <Send className="w-4 h-4" />
                            {submitting ? 'Mengirim...' : 'Kirim Laporan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
