import { Clock, Loader, CheckCircle2, XCircle } from 'lucide-react';

export const REPORT_STATUS = {
  pending: {
    label: 'Menunggu',
    icon: Clock,
    className: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20',
    iconClass: 'text-amber-500 dark:text-amber-400',
  },
  processed: {
    label: 'Diproses',
    icon: Loader,
    className: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-500/20',
    iconClass: 'text-blue-500 dark:text-blue-400',
  },
  completed: {
    label: 'Selesai',
    icon: CheckCircle2,
    className: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20',
    iconClass: 'text-emerald-500 dark:text-emerald-400',
  },
  rejected: {
    label: 'Ditolak',
    icon: XCircle,
    className: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200/60 dark:border-red-500/20',
    iconClass: 'text-red-500 dark:text-red-400',
  },
};

export const STATUS_LABELS = {
  pending: 'Menunggu',
  processed: 'Diproses',
  completed: 'Selesai',
  rejected: 'Ditolak',
};
