import React from 'react';
import { Plus } from 'lucide-react';

export default function FloatingActionButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-[124px] right-6 z-[2001] w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
            <Plus className="w-6 h-6" />
        </button>
    );
}
