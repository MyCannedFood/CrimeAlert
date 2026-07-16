import { useState } from 'react';

const nearestItems = [
    {
        category: 'Pencurian',
        title: 'Kejadian pencurian motor di dekat stasiun kereta yang cukup ramai penumpang',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
    {
        category: 'Waspada',
        title: 'Tindak kriminal ringan terjadi di area taman kota pada malam hari',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
    {
        category: 'Penipuan',
        title: 'Laporan penipuan online berkedok kurir paket mengincar warga sekitar',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
    {
        category: 'Kekerasan',
        title: 'Perselisihan warga berujung keributan kecil di gang permukiman',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
    {
        category: 'Pencurian',
        title: 'Pencurian kendaraan bermotor terjadi saat pemilik lengah di parkiran',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
    {
        category: 'Waspada',
        title: 'Warga diminta waspada modus penipuan berkedok petugas resmi',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
    {
        category: 'Penipuan',
        title: 'Modus penipuan transfer dana palsu kembali marak di sekitar wilayah ini',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
    {
        category: 'Kekerasan',
        title: 'Insiden kecil di area publik memicu kehadiran petugas keamanan setempat',
        author: 'Floyd Miles',
        time: '3 Hari lalu',
    },
];

const TOTAL_PAGES = 5;

// Consistent edge padding for header, grid, and pagination once the section
// breaks out to full viewport width (same approach as LatestNewsSection).
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

    return (
        <section
            style={{
                marginBottom: '2rem',
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            {/* Full-bleed breakout wrapper: escapes the parent's max-width container
                so the whole section (header + grid + pagination) can stretch to the
                real viewport edge, matching LatestNewsSection. */}
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
                            color: '#0F172A',
                            margin: '0 0 0.4rem 0',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Berita Kriminal Terdekat
                    </h2>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>
                        Kejadian terbaru di sekitar Jakarta Barat dan area sekitarnya.
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
                className="nearest-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '2rem',
                    paddingLeft: EDGE_PADDING,
                    paddingRight: EDGE_PADDING,
                }}
            >
                {nearestItems.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{
                                    height: '260px',
                                    width: '100%',
                                    background: '#94A3B8',
                                }}
                            />
                            <span
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    bottom: '-14px',
                                    background: '#FFFFFF',
                                    borderRadius: '6px',
                                    padding: '0.3rem 0.65rem',
                                    fontSize: '0.72rem',
                                    fontWeight: 500,
                                    color: '#64748B',
                                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.1)',
                                }}
                            >
                                {item.category}
                            </span>
                        </div>

                        <div
                            style={{
                                padding: '1.75rem 1.1rem 1.1rem',
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            }}
                        >
                            <h3
                                style={{
                                    fontSize: '1.02rem',
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
                    aria-label="Halaman sebelumnya"
                    style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'transparent',
                        color: '#94A3B8',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {'\u2039'}
                </button>

                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => setActivePage(page)}
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            border: 'none',
                            background: activePage === page ? '#2563EB' : 'transparent',
                            color: activePage === page ? '#FFFFFF' : '#334155',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                        }}
                    >
                        {page}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => setActivePage((p) => Math.min(TOTAL_PAGES, p + 1))}
                    aria-label="Halaman berikutnya"
                    style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: 'none',
                        background: 'transparent',
                        color: '#334155',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {'\u203A'}
                </button>
            </div>
            </div>

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
        </section>
    );
}