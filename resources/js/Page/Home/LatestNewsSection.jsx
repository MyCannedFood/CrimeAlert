const newsItems = [
    {
        category: 'Pencurian',
        title: 'Laporan pencurian motor di area pusat kota meningkat dalam 24 jam terakhir',
        author: 'Rina Putri',
        time: '3 jam lalu',
    },
    {
        category: 'Penipuan',
        title: 'Modus penipuan online berkedok pemberitahuan resmi kembali mencuat',
        author: 'Dimas Arka',
        time: '5 jam lalu',
    },
    {
        category: 'Kekerasan',
        title: 'Insiden bentrokan di pasar tradisional menimbulkan kerusuhan ringan',
        author: 'Sari Wulandari',
        time: '7 jam lalu',
    },
    {
        category: 'Penggelapan',
        title: 'Kasus penggelapan dana bantuan sosial sedang dalam penyelidikan',
        author: 'Hendra N',
        time: '9 jam lalu',
    },
    {
        category: 'Lalu Lintas',
        title: 'Kecelakaan beruntun di tol utama mengakibatkan penutupan sementara',
        author: 'Ayu Lestari',
        time: '12 jam lalu',
    },
];

// Consistent edge padding used by both the header row and the card row,
// so they stay aligned once the section breaks out to full viewport width.
const EDGE_PADDING = 'clamp(1.25rem, 4vw, 3rem)';

export default function LatestNewsSection() {
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
                                color: '#0F172A',
                                margin: '0 0 0.3rem 0',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            Berita Kriminal Terkini
                        </h2>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
                            Laporan terverifikasi terbaru dari sumber tepercaya
                        </p>
                    </div>
                    <a
                        href="/berita"
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
                    {newsItems.map((item, index) => (
                        <div
                            key={index}
                            className="news-card"
                            style={{
                                background: '#FFFFFF',
                                border: 'none',
                                borderRadius: '18px',
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                boxSizing: 'border-box',
                                flex: '0 0 auto',
                                width: '272px',
                                scrollSnapAlign: 'start',
                                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
                            }}
                        >
                            <div
                                style={{
                                    height: '300px',
                                    width: '100%',
                                    background: '#94A3B8',
                                    position: 'relative',
                                    flexShrink: 0,
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '0.9rem',
                                        left: '0.9rem',
                                        background: 'rgba(255,255,255,0.92)',
                                        padding: '0.32rem 0.75rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        color: '#475569',
                                        borderRadius: '999px',
                                    }}
                                >
                                    {item.category}
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1,
                                }}
                            >
                                <h3
                                    style={{
                                        fontSize: '1.05rem',
                                        fontWeight: 700,
                                        color: '#1E293B',
                                        margin: '0 0 1rem 0',
                                        lineHeight: 1.4,
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
                                        fontSize: '0.85rem',
                                        color: '#94A3B8',
                                    }}
                                >
                                    <span style={{ fontWeight: 700, color: '#64748B' }}>{item.author}</span>
                                    <span>{item.time}</span>
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