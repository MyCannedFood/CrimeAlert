import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

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

const EDGE_PADDING = 'clamp(1.25rem, 4vw, 3rem)';

export default function LatestNewsSection() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [brokenImgs, setBrokenImgs] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        api.crimes.list({ per_page: 5 })
            .then((data) => setItems(data || []))
            .catch(() => setItems([]))
            .finally(() => setLoading(false))
    }, []);
    return (
        <section
            style={{
                marginBottom: '2rem',
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            {/* Full-bleed breakout wrapper: escapes the parent's max-width container
                so the whole section (header + cards) can stretch to the real
                viewport edge, like the reference. */}
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
                        marginBottom: '1.25rem',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        paddingLeft: EDGE_PADDING,
                        paddingRight: EDGE_PADDING,
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 800,
                                color: 'var(--color-text)',
                                margin: '0 0 0.3rem 0',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Berita Kriminal Terkini
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.95rem' }}>
                            Laporan terverifikasi terbaru dari sumber tepercaya
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
                        Lihat Semua <span style={{ fontSize: '1rem' }}>{'\u2192'}</span>
                    </a>
                </div>

                <div
                    className="news-scroll"
                    style={{
                        display: 'flex',
                        gap: '1.5rem',
                        overflowX: 'auto',
                        scrollSnapType: 'x proximity',
                        paddingTop: '0.25rem',
                        paddingBottom: '0.75rem',
                        paddingLeft: EDGE_PADDING,
                        paddingRight: EDGE_PADDING,
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {loading && Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={`skeleton-${i}`}
                            className="news-skeleton"
                            style={{
                                background: 'var(--color-bg-card)',
                                    border: '1px solid var(--color-card-border)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxSizing: 'border-box',
                                    flex: '0 0 auto',
                                    width: '272px',
                                    scrollSnapAlign: 'start',
                                }}
                            >
                                <div style={{ height: '14rem', width: '100%', background: 'var(--color-skeleton)' }} />
                                <div style={{ padding: '1.25rem' }}>
                                    <div style={{ height: '1rem', background: 'var(--color-skeleton)', borderRadius: '4px', marginBottom: '0.75rem', width: '80%' }} />
                                    <div style={{ height: '1rem', background: 'var(--color-skeleton)', borderRadius: '4px', width: '60%' }} />
                                    <div style={{ height: '0.75rem', background: 'var(--color-skeleton)', borderRadius: '4px', marginTop: '1.5rem', width: '40%' }} />
                            </div>
                        </div>
                    ))}
                    {!loading && items.length === 0 && (
                        <div style={{ padding: '2rem 1rem', color: '#94A3B8', textAlign: 'center', width: '100%' }}>
                            Belum ada berita terbaru
                        </div>
                    )}
                    {items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/berita/${item.id}`)}
                            className="news-card"
                            style={{
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-card-border)',
                                borderRadius: 0,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                boxSizing: 'border-box',
                                flex: '0 0 auto',
                                width: '272px',
                                scrollSnapAlign: 'start',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                transition: 'box-shadow 0.2s, transform 0.2s',
                            }}
                        >
                            <div
                                style={{
                                    height: '14rem',
                                    width: '100%',
                                    background: '#E2E8F0',
                                    position: 'relative',
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                }}
                            >
                                {item.image_url && !brokenImgs[item.id] ? (
                                    <img
                                        src={item.image_url}
                                        alt={item.title}
                                        onError={() => setBrokenImgs((p) => ({ ...p, [item.id]: true }))}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 500 }}>
                                        Gambar tidak tersedia
                                    </div>
                                )}
                                <div
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
                                </div>
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
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                .news-scroll {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .news-scroll::-webkit-scrollbar {
                    display: none;
                    width: 0;
                    height: 0;
                }
                .news-card:hover {
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
                    transform: translateY(-2px);
                }
                @media (max-width: 640px) {
                    .news-card {
                        width: 220px !important;
                    }
                    .news-card > div:first-child {
                        height: 240px !important;
                    }
                }
                @media (max-width: 380px) {
                    .news-card {
                        width: 200px !important;
                    }
                }
            `}</style>
        </section>
    );
}