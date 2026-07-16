import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const ITEMS_PER_PAGE = 8;

function timeAgo(dateStr) {
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

// Consistent edge padding for header, grid, and pagination once the section
// breaks out to full viewport width.
const EDGE_PADDING = 'clamp(1.25rem, 4vw, 3rem)';

function LocationPinIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
}

export default function NearestNewsSection() {
    const [activePage, setActivePage] = useState(1);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.crimes.list()
            .then((data) => setItems(data || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false));
    }, []);

    const totalPages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
    const startIdx = (activePage - 1) * ITEMS_PER_PAGE;
    const pageItems = items.slice(startIdx, startIdx + ITEMS_PER_PAGE);

    const PAGINATION_WINDOW = 5;
    const getVisiblePages = (current, total) => {
        const clampedTotal = Math.max(1, total);
        const windowSize = Math.min(PAGINATION_WINDOW, clampedTotal);

        const start = Math.max(
            1,
            Math.min(
                current - Math.floor(windowSize / 2),
                clampedTotal - windowSize + 1
            )
        );
        const end = Math.min(clampedTotal, start + windowSize - 1);

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    const visiblePages = getVisiblePages(activePage, totalPages);

    return (
        <section
            style={{
                marginBottom: '2rem',
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            {/* Full-bleed breakout wrapper */}
            <div
                style={{
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '1.5rem',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        paddingLeft: EDGE_PADDING,
                        paddingRight: EDGE_PADDING,
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                color: '#2563EB',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                marginBottom: '0.5rem',
                            }}
                        >
                            <LocationPinIcon />
                            Berdasarkan Lokasi Anda
                        </div>
                        <h2
                            style={{
                                fontSize: '2.1rem',
                                fontWeight: 800,
                                color: 'var(--color-text)',
                                margin: '0 0 0.4rem 0',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Berita Kriminal Terdekat
                        </h2>
                        <p
                            style={{
                                color: 'var(--color-text-secondary)',
                                margin: 0,
                                fontSize: '0.95rem',
                            }}
                        >
                            Kejadian terbaru di sekitar Jakarta Barat dan area sekitarnya.
                        </p>
                    </div>
                    <a
                        href="/news"
                        style={{
                            color: '#2563EB',
                            textDecoration: 'none',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Lihat Semua <span style={{ fontSize: '1rem' }}>→</span>
                    </a>
                </div>

                <div
                    className="nearest-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '2rem',
                        paddingLeft: EDGE_PADDING,
                        paddingRight: EDGE_PADDING,
                    }}
                >
                    {loading &&
                        Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={`skeleton-${i}`}
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-card-border)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box',
                                }}
                            >
                                <div
                                    style={{
                                        height: '14rem',
                                        width: '100%',
                                        background: 'var(--color-skeleton)',
                                    }}
                                />
                                <div style={{ padding: '1.25rem' }}>
                                    <div
                                        style={{
                                            height: '1rem',
                                            background: 'var(--color-skeleton)',
                                            borderRadius: '4px',
                                            marginBottom: '0.75rem',
                                            width: '80%',
                                        }}
                                    />
                                    <div
                                        style={{
                                            height: '1rem',
                                            background: 'var(--color-skeleton)',
                                            borderRadius: '4px',
                                            width: '60%',
                                        }}
                                    />
                                    <div
                                        style={{
                                            height: '0.75rem',
                                            background: 'var(--color-skeleton)',
                                            borderRadius: '4px',
                                            marginTop: '1.5rem',
                                            width: '40%',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}

                    {!loading && pageItems.length === 0 && (
                        <div
                            style={{
                                gridColumn: '1 / -1',
                                padding: '2rem',
                                color: 'var(--color-text-muted)',
                                textAlign: 'center',
                            }}
                        >
                            Belum ada data kriminal terdekat
                        </div>
                    )}

                    {!loading &&
                        pageItems.map((item, index) => (
                            <a
                                key={index}
                                href={`/berita/${item.id}`}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-card-border)',
                                    borderRadius: 0,
                                    overflow: 'hidden',
                                    boxSizing: 'border-box',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    cursor: 'pointer',
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            style={{
                                                height: '14rem',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                height: '14rem',
                                                width: '100%',
                                                background: 'var(--color-skeleton)',
                                            }}
                                        />
                                    )}
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            bottom: 0,
                                            background: 'var(--color-bg-card)',
                                            padding: '0.375rem 0.75rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        {item.category}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        padding: '1.25rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flexGrow: 1,
                                    }}
                                >
                                    <h3
                                        style={{
                                            fontSize: '17px',
                                            fontWeight: 700,
                                            color: 'var(--color-text)',
                                            margin: '0 0 1.5rem 0',
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {item.title}
                                    </h3>

                                    <div
                                        style={{
                                            marginTop: 'auto',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.75rem',
                                            color: '#9CA3AF',
                                            fontWeight: 500,
                                        }}
                                    >
                                        <span>{item.source || 'Sumber tidak diketahui'}</span>
                                        <span>{timeAgo(item.date)}</span>
                                    </div>
                                </div>
                            </a>
                        ))}
                </div>

                {!loading && items.length > ITEMS_PER_PAGE && (
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            gap: '0.4rem',
                            marginTop: '2rem',
                            flexWrap: 'wrap',
                            paddingLeft: EDGE_PADDING,
                            paddingRight: EDGE_PADDING,
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setActivePage((p) => Math.max(1, p - 1))}
                            disabled={activePage === 1}
                            className={`p-2 ${
                                activePage === 1
                                    ? 'text-gray-300 dark:text-slate-600 cursor-not-allowed'
                                    : 'text-black dark:text-slate-300 hover:text-gray-700 dark:hover:text-slate-400'
                            } transition-colors`}
                            aria-label="Halaman sebelumnya"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        {visiblePages.map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => setActivePage(page)}
                                className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-sm transition-colors ${
                                    activePage === page
                                        ? 'bg-[#0ea5e9] text-white'
                                        : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
                            disabled={activePage === totalPages}
                            className={`p-2 ${
                                activePage === totalPages
                                    ? 'text-gray-300 dark:text-slate-600 cursor-not-allowed'
                                    : 'text-black dark:text-slate-300 hover:text-gray-700 dark:hover:text-slate-400'
                            } transition-colors`}
                            aria-label="Halaman berikutnya"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                )}

                <style>{`
                    @media (max-width: 1024px) {
                        .nearest-grid {
                            grid-template-columns: repeat(3, 1fr) !important;
                        }
                    }
                    @media (max-width: 768px) {
                        .nearest-grid {
                            grid-template-columns: repeat(2, 1fr) !important;
                        }
                    }
                    @media (max-width: 480px) {
                        .nearest-grid {
                            grid-template-columns: 1fr !important;
                        }
                    }
                `}</style>
            </div>
        </section>
    );
}

