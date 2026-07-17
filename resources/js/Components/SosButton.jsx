import { useState } from 'react';
import { Phone } from 'lucide-react';
import EmergencyModal from './EmergencyModal';

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-16 z-[2000] flex flex-col items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer group relative"
          aria-label="Kontak Darurat"
        >
          <Phone className="w-6 h-6 group-hover:animate-pulse" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-ping opacity-75" />
        </button>
        <span className="text-[11px] font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full shadow-xs border border-red-200 dark:border-red-800 whitespace-nowrap">
          SOS
        </span>
      </div>

      <EmergencyModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
