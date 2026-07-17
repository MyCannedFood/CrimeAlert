import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const styleId = 'dropdown-scrollbar-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .dropdown-scroll::-webkit-scrollbar { width: 6px; }
    .dropdown-scroll::-webkit-scrollbar-track { background: transparent; }
    .dropdown-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 9999px; }
    .dark .dropdown-scroll::-webkit-scrollbar-thumb { background: #475569; }
    .dropdown-scroll { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
    .dark .dropdown-scroll { scrollbar-color: #475569 transparent; }
  `;
  document.head.appendChild(style);
}

export default function Dropdown({ icon: Icon, label, value, onChange, options, variant = 'pill' }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const panel = (
    <div
      role="listbox"
      className="dropdown-scroll absolute z-[1100] mt-2 max-h-64 w-full min-w-[200px] overflow-y-auto rounded-xl border border-slate-100 bg-white py-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-800"
      style={variant === 'pill' ? { left: 0 } : undefined}
    >
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            role="option"
            aria-selected={active}
            onClick={() => {
              onChange(o);
              setOpen(false);
            }}
            className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-[13.5px] font-medium transition-colors ${
              active
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400'
                : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700/70'
            }`}
          >
            <span className="truncate">{o}</span>
            {active && <Check className="h-3.5 w-3.5 shrink-0" />}
          </button>
        );
      })}
    </div>
  );

  if (variant === 'block') {
    return (
      <div ref={rootRef} className="relative">
        {label && (
          <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {label}
          </span>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2.5 rounded-lg border border-slate-200 px-3.5 py-3 text-left dark:border-slate-700"
        >
          {Icon && <Icon className="h-4 w-4 shrink-0 text-slate-400" />}
          <span className="flex-1 truncate text-[14px] font-medium text-slate-900 dark:text-slate-200">{value}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
        {open && panel}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 shadow-md transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-600"
      >
        {Icon && <Icon className="h-[15px] w-[15px] text-blue-600" />}
        <span className="max-w-[150px] truncate">{value}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && panel}
    </div>
  );
}
