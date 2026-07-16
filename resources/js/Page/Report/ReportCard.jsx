import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowBigUp, 
    ArrowBigDown, 
    MapPin, 
    Tag, 
    MessageSquare, 
    CheckCircle2, 
    Clock 
} from 'lucide-react';

function formatTime(dateStr) {
    if (!dateStr) return 'Baru saja';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Baru saja';
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID');
}

export default function ReportCard({ report, onVote }) {
    const [voteCount, setVoteCount] = useState((report.upvotes || 0) - (report.downvotes || 0));
    const [userVote, setUserVote] = useState(report.userVote || null);

    const handleVote = (e, type) => {
        e.preventDefault();
        e.stopPropagation();
        
        let newCount = voteCount;
        let newVote = userVote;

        if (userVote === type) {
            newVote = null;
            newCount += type === 'up' ? -1 : 1;
        } else {
            if (userVote === 'up') newCount -= 1;
            if (userVote === 'down') newCount += 1;
            newCount += type === 'up' ? 1 : -1;
            newVote = type;
        }

        setVoteCount(newCount);
        setUserVote(newVote);
        if (onVote) onVote(report.id, newVote);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 md:p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex gap-4 items-start">
            {/* Vote Column */}
            <div className="flex flex-col items-center bg-slate-50/80 dark:bg-slate-800/80 rounded-lg p-1 min-w-[40px] border border-slate-100 dark:border-slate-700/50">
                <button
                    onClick={(e) => handleVote(e, 'up')}
                    className={`p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
                        userVote === 'up' ? 'text-blue-600 dark:text-blue-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                    aria-label="Upvote"
                >
                    <ArrowBigUp className={`w-5 h-5 ${userVote === 'up' ? 'fill-blue-600 dark:fill-blue-500' : ''}`} />
                </button>

                <span className={`text-xs font-semibold my-0.5 ${
                    userVote === 'up' ? 'text-blue-600 dark:text-blue-500 font-bold' : userVote === 'down' ? 'text-rose-600 dark:text-rose-500 font-bold' : 'text-slate-700 dark:text-slate-300'
                }`}>
                    {voteCount}
                </span>

                <button
                    onClick={(e) => handleVote(e, 'down')}
                    className={`p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors ${
                        userVote === 'down' ? 'text-rose-600 dark:text-rose-500' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                    aria-label="Downvote"
                >
                    <ArrowBigDown className={`w-5 h-5 ${userVote === 'down' ? 'fill-rose-600 dark:fill-rose-500' : ''}`} />
                </button>
            </div>

            {/* Content Column */}
            <div className="flex-grow min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">u/{report.username || 'WargaAnonim'}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>{formatTime(report.created_at)}</span>
                    {report.province && (
                        <>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="inline-flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md font-medium text-[11px]">
                                <MapPin className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                {report.city ? `${report.city}, ` : ''}{report.province}
                            </span>
                        </>
                    )}
                </div>

                <Link to={`/laporan/${report.id}`} className="block group">
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-1.5">
                        {report.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-3 leading-relaxed">
                        {report.description}
                    </p>
                </Link>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-1 text-xs">
                    <div className="flex items-center gap-2">
                        {report.category && (
                            <span className="inline-flex items-center gap-1 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-medium text-xs border border-slate-200/60 dark:border-slate-700/50">
                                <Tag className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                {report.category}
                            </span>
                        )}
                        {report.status && (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-medium text-xs ${
                                report.status === 'verified' 
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20' 
                                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20'
                            }`}>
                                {report.status === 'verified' ? (
                                    <>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                                        Terverifikasi
                                    </>
                                ) : (
                                    <>
                                        <Clock className="w-3 h-3 text-amber-500 dark:text-amber-400" />
                                        Menunggu Konfirmasi
                                    </>
                                )}
                            </span>
                        )}
                    </div>

                    <Link 
                        to={`/laporan/${report.id}`} 
                        className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-xs transition-colors"
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Detail
                    </Link>
                </div>
            </div>
        </div>
    );
}
