import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { FileText, X, Send, Upload, MapPin } from 'lucide-react';
import { api } from '../../utils/api';
import { useDarkMode } from '../../utils/DarkModeProvider';

const locationIcon = L.divIcon({
  className: 'bg-transparent',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#ffffff" stroke="#ef4444" stroke-width="2"/></svg>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const INDONESIAN_PROVINCES = [
    'Aceh',
    'Sumatera Utara',
    'Sumatera Barat',
    'Riau',
    'Kepulauan Riau',
    'Jambi',
    'Sumatera Selatan',
    'Bangka Belitung',
    'Bengkulu',
    'Lampung',
    'DKI Jakarta',
    'Banten',
    'Jawa Barat',
    'Jawa Tengah',
    'DI Yogyakarta',
    'Jawa Timur',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur',
    'Kalimantan Barat',
    'Kalimantan Tengah',
    'Kalimantan Selatan',
    'Kalimantan Timur',
    'Kalimantan Utara',
    'Sulawesi Utara',
    'Sulawesi Tengah',
    'Sulawesi Selatan',
    'Sulawesi Tenggara',
    'Gorontalo',
    'Sulawesi Barat',
    'Maluku',
    'Maluku Utara',
    'Papua',
    'Papua Barat',
];

function MiniLocationPicker({ lat, lng, onLocationChange, onReset }) {
  const { isDark } = useDarkMode();
  const [position, setPosition] = useState([lat, lng]);

  useEffect(() => {
    setPosition([lat, lng]);
  }, [lat, lng]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationChange(lat, lng);
      },
    });
    return position ? <Marker position={position} icon={locationIcon} /> : null;
  }

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        Titik Lokasi
      </label>
      <div className="relative h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        <MapContainer center={[lat, lng]} zoom={15} className="w-full h-full" scrollWheelZoom={true} dragging={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={isDark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
          <LocationMarker />
        </MapContainer>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="absolute bottom-8 right-2 z-[1000] py-1 px-2.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-xs transition-colors backdrop-blur-sm cursor-pointer"
          >
            Reset Posisi
          </button>
        )}
      </div>
      <p className="text-[11px] text-slate-400 dark:text-slate-500">
        {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)} — Klik peta untuk menyesuaikan titik
      </p>
    </div>
  );
}

export default function CreateReportModal({ isOpen, onClose, onSubmit, user }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [username, setUsername] = useState('');
    const [showName, setShowName] = useState(true);
    const [emailName, setEmailName] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState(INDONESIAN_PROVINCES);
    const [location, setLocation] = useState(null);
    const [locationAddress, setLocationAddress] = useState('');
    const [locationError, setLocationError] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const reverseGeocode = async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`
            );
            const data = await res.json();
            setLocationAddress(data.display_name || '');
            const addr = data.address || {};
            const prov = addr.state || addr.region || '';
            const matched = INDONESIAN_PROVINCES.find((p) => prov.includes(p));
            if (matched) setProvince(matched);
            const detectedCity = addr.city || addr.town || addr.village || addr.municipality || addr.county || '';
            if (detectedCity) setCity(detectedCity);
        } catch {
            // fallback
        }
    };

    const loadLocation = () => {
        setLocationError('');
        setLocation(null);
        setLocationAddress('');
        setLatitude('');
        setLongitude('');

        if (!navigator.geolocation) {
            setLocationError('Geolokasi tidak didukung browser Anda.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setLocation({ lat, lng });
                setLatitude(lat);
                setLongitude(lng);
                reverseGeocode(lat, lng);
            },
            () => setLocationError('Gagal mendapatkan lokasi. Izin lokasi mungkin ditolak.')
        );
    };

    // Kunci scroll pada body (layar belakang) selama modal terbuka
    useEffect(() => {
        if (!isOpen) return;
        loadLocation();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const scrollY = window.scrollY;

        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        api.getCategoryOptions().then((cats) => {
            if (cats.length > 0) setCategories(cats);
        });

        const fullNameFromMeta =
            user?.user_metadata?.full_name ||
            user?.user_metadata?.fullName ||
            user?.user_metadata?.display_name ||
            user?.user_metadata?.displayName ||
            (user?.user_metadata?.first_name && user?.user_metadata?.last_name
                ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                : null) ||
            null;

        // fallback: pakai email name part jika full name tidak ada
        const rawEmail = user?.email || user?.user_metadata?.email;
        let fallbackName = '';
        if (typeof rawEmail === 'string' && rawEmail.includes('@')) {
            fallbackName = rawEmail.split('@')[0];
        }

        const finalName = typeof fullNameFromMeta === 'string' && fullNameFromMeta.trim()
            ? fullNameFromMeta.trim()
            : fallbackName;

        if (finalName) {
            setEmailName(finalName);
            setShowName(true);
            setUsername(finalName);
        } else {
            setEmailName('');
            setShowName(false);
            setUsername('');
        }
    }, [isOpen, user]);

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
        if (!imageFile) {
            setError('Gambar kejadian wajib dilampirkan');
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
                latitude: latitude || null,
                longitude: longitude || null,
                username: showName ? (username.trim() || emailName || 'Anonim') : 'Anonim',
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
            setShowName(true);
            setEmailName('');
            setImageFile(null);
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
            setLocation(null);
            setLocationAddress('');
            setLocationError('');
            setLatitude('');
            setLongitude('');
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
        setTitle('');
        setDescription('');
        setCategory('');
        setProvince('');
        setCity('');
        setUsername('');
        setShowName(true);
        setEmailName('');
        setLocation(null);
        setLocationAddress('');
        setLocationError('');
        setLatitude('');
        setLongitude('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-colors duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full max-h-[90vh] shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-300 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 pt-6 pb-4 shrink-0">
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

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {error && (
                        <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs rounded-lg border border-rose-200/80 dark:border-rose-500/20 font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                            Nama Pelapor (Opsional)
                        </label>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowName(true);
                                    if (!username && emailName) setUsername(emailName);
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                    showName
                                        ? 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300'
                                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                                }`}
                            >
                                Tampilkan nama
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowName(false);
                                    setUsername('');
                                }}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                                    !showName
                                        ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300'
                                        : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                                }`}
                            >
                                Tetap anonim
                            </button>
                        </div>

                        <input
                            type="text"
                            value={showName ? username : ''}
                            placeholder="Anonim jika dikosongkan"
                            disabled
                            readOnly
                            className={`w-full border ${
                                showName
                                    ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950'
                                    : 'border-slate-200/70 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'
                            } text-slate-900 dark:text-white rounded-lg px-3.5 py-2 text-sm outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 cursor-not-allowed opacity-90`}
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

                    {location && (
                        <div className="space-y-3">
                            <MiniLocationPicker
                                lat={latitude}
                                lng={longitude}
                                onLocationChange={(lat, lng) => {
                                    setLatitude(lat);
                                    setLongitude(lng);
                                    reverseGeocode(lat, lng);
                                }}
                                onReset={() => {
                                    setLatitude(location.lat);
                                    setLongitude(location.lng);
                                    reverseGeocode(location.lat, location.lng);
                                }}
                            />
                            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-0.5">Lokasi Terdeteksi</p>
                                        <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed line-clamp-2">
                                            {locationAddress || `${location.lat}, ${location.lng}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {locationError && (
                        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-3">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                                <p className="text-xs font-medium text-amber-700 dark:text-amber-300">{locationError}</p>
                            </div>
                            <button
                                type="button"
                                onClick={loadLocation}
                                className="w-full py-2 px-4 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                            >
                                Aktifkan Lokasi
                            </button>
                        </div>
                    )}

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
                            Gambar Kejadian *
                        </label>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                            Lampirkan bukti pendukung seperti foto barang curian, kendaraan, plat nomor, STNK, atau dokumen kepemilikan lainnya.
                        </p>
                        <div
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const file = e.dataTransfer.files?.[0];
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
                            }}
                            onClick={() => document.getElementById('image-upload-input')?.click()}
                            className="relative cursor-pointer"
                        >
                            <input
                                id="image-upload-input"
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {imagePreview ? (
                                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            URL.revokeObjectURL(imagePreview);
                                            setImagePreview(null);
                                            setImageFile(null);
                                        }}
                                        className="absolute top-1.5 right-1.5 bg-slate-900/60 hover:bg-slate-900/80 text-white p-1 rounded-full transition-colors cursor-pointer"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-24 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 flex flex-col items-center justify-center gap-1 text-xs text-slate-400 dark:text-slate-500 transition-colors">
                                    <Upload className="w-5 h-5" />
                                    <span>Seret &amp; lepas gambar di sini, atau klik untuk memilih</span>
                                    <span className="text-[10px]">Maks. 5MB — JPG, PNG, GIF, WebP</span>
                                </div>
                            )}
                        </div>
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

                </div>

                    <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
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