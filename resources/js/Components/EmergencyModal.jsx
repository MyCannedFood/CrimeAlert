import { useState, useEffect } from 'react';
import { X, Phone, MapPin, Shield, Ambulance as AmbulanceIcon, Flame, Search, Zap } from 'lucide-react';
import { NATIONAL_CONTACTS, PROVINCE_CONTACTS } from '../data/emergencyContacts';

const ICON_MAP = {
  shield: Shield,
  ambulance: AmbulanceIcon,
  flame: Flame,
  search: Search,
  zap: Zap,
};

const CONTACT_TYPE_STYLES = {
  police: { bg: 'bg-blue-50 dark:bg-blue-500/10', border: 'border-blue-200 dark:border-blue-500/30', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-600 dark:text-blue-400', btn: 'bg-blue-600 hover:bg-blue-700' },
  hospital: { bg: 'bg-red-50 dark:bg-red-500/10', border: 'border-red-200 dark:border-red-500/30', text: 'text-red-700 dark:text-red-300', icon: 'text-red-600 dark:text-red-400', btn: 'bg-red-600 hover:bg-red-700' },
  fire: { bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-200 dark:border-orange-500/30', text: 'text-orange-700 dark:text-orange-300', icon: 'text-orange-600 dark:text-orange-400', btn: 'bg-orange-600 hover:bg-orange-700' },
};

const CONTACT_DEFAULTS = { bg: 'bg-slate-50 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', text: 'text-slate-700 dark:text-slate-300', icon: 'text-slate-500 dark:text-slate-400', btn: 'bg-slate-600 hover:bg-slate-700' };

export default function EmergencyModal({ isOpen, onClose }) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [locationError, setLocationError] = useState('');
  const [activeTab, setActiveTab] = useState('daerah');
  const [province, setProvince] = useState('default');

  const loadLocation = () => {
    setLocationError('');
    setLocation(null);
    setAddress('');

    if (!navigator.geolocation) {
      setLocationError('Geolokasi tidak didukung browser Anda.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&accept-language=id`
          );
          const data = await res.json();
          setAddress(data.display_name || '');
          const addr = data.address || {};
          const prov = addr.state || addr.region || 'default';
          const matched = Object.keys(PROVINCE_CONTACTS).find((p) => prov.includes(p));
          if (matched) setProvince(matched);
        } catch {
          // fallback
        }
      },
      () => setLocationError('Gagal mendapatkan lokasi. Izin lokasi mungkin ditolak.')
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    loadLocation();
  }, [isOpen]);

  const handleCall = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

  if (!isOpen) return null;

  const provinceContacts = PROVINCE_CONTACTS[province] || PROVINCE_CONTACTS.default;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[85vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Kontak Darurat</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Hubungi layanan darurat dengan cepat</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('daerah')}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${activeTab === 'daerah' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Daerah
            </button>
            <button
              onClick={() => setActiveTab('nasional')}
              className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer ${activeTab === 'nasional' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              Nasional
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
          {activeTab === 'nasional' && NATIONAL_CONTACTS.map((contact) => {
            const Icon = ICON_MAP[contact.icon] || Phone;
            return (
              <div key={contact.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{contact.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCall(contact.phone)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Hubungi
                </button>
              </div>
            );
          })}

          {activeTab === 'daerah' && (
            <>
              {location && (
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-0.5">Lokasi Terdeteksi</p>
                      <p className="text-xs text-green-600 dark:text-green-400 leading-relaxed">
                        {address || `${location.lat}, ${location.lng}`}
                      </p>
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
                    onClick={loadLocation}
                    className="w-full py-2 px-4 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                  >
                    Aktifkan Lokasi
                  </button>
                </div>
              )}

              {province !== 'default' && (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kontak {province}</p>
              )}

              {provinceContacts.map((contact) => {
                const style = CONTACT_TYPE_STYLES[contact.type] || CONTACT_DEFAULTS;
                return (
                  <div key={contact.name} className={`flex items-center justify-between p-3 rounded-xl ${style.bg} ${style.border} border`}>
                    <div className="flex items-center gap-3">
                      <div>
                        <p className={`text-sm font-semibold ${style.text}`}>{contact.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{contact.phone}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCall(contact.phone)}
                      className={`flex items-center gap-1.5 px-4 py-2 ${style.btn} text-white text-sm font-semibold rounded-lg transition-colors shadow-xs cursor-pointer`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      Hubungi
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 shrink-0">
          <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed">
            Pastikan Anda dalam keadaan aman sebelum menghubungi. Nomor darurat dapat berbeda tergantung wilayah.
          </p>
        </div>
      </div>
    </div>
  );
}
