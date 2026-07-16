import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
    const [userCity, setUserCity] = useState('Mendeteksi lokasi...');

    useEffect(() => {
        if (!navigator.geolocation) {
            setUserCity('Lokasi tidak tersedia');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=10&addressdetails=1`,
                        {
                            headers: {
                                'Accept-Language': 'id-ID',
                            },
                        }
                    );
                    const data = await response.json();
                    const detectedCity =
                        data?.address?.city ||
                        data?.address?.town ||
                        data?.address?.village ||
                        data?.address?.suburb ||
                        data?.address?.city_district ||
                        'Lokasi tidak tersedia';

                    setUserCity(detectedCity);
                } catch (error) {
                    setUserCity('Lokasi tidak tersedia');
                }
            },
            () => {
                setUserCity('Lokasi tidak tersedia');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
    }, []);

    const stats = [
        {
            label: 'Laporan Hari Ini',
            value: '1.284',
            iconBg: '#DBEAFE',
            iconColor: '#2563EB',
            icon: (
                <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M13 2v5h5 M8 12h6 M8 15.5h6 M8 8.5h2" />
            ),
            sub: null,
        },
        {
            label: 'Daerah Terpantau',
            value: '38',
            iconBg: '#FFEDD5',
            iconColor: '#F97316',
            icon: <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />,
            iconExtra: (
                <>
                    <path d="M3 12h18" />
                    <path d="M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" />
                </>
            ),
            sub: { text: '3% VS Minggu Lalu', color: '#16A34A', direction: 'down' },
        },
        {
            label: 'Berita Terverifikasi',
            value: '96%',
            iconBg: '#DCFCE7',
            iconColor: '#22C55E',
            icon: <path d="M20 6 9 17l-5-5" />,
            sub: null,
        },
        {
            label: 'Sumber Media Resmi',
            value: '12',
            iconBg: '#F1F5F9',
            iconColor: '#94A3B8',
            icon: (
                <path d="M4 6c0-1.1 3.6-2 8-2s8 .9 8 2-3.6 2-8 2-8-.9-8-2zM4 6v12c0 1.1 3.6 2 8 2s8-.9 8-2V6 M4 12c0 1.1 3.6 2 8 2s8-.9 8-2" />
            ),
            sub: null,
        },
    ];

    return (
        <section
            className="hero-section"
            style={{
                width: '100%',
                background: 'linear-gradient(135deg, #EAF0FE 0%, #DCE6FB 100%)',
                padding: '4rem 1.25rem 3.5rem',
                margin: 0,
                borderRadius: 0,
                boxSizing: 'border-box',
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: '0 auto auto -3rem',
                    width: '280px',
                    height: '280px',
                    background: 'rgba(255,255,255,0.28)',
                    filter: 'blur(20px)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    inset: 'auto -2rem 0 auto',
                    width: '220px',
                    height: '220px',
                    background: 'rgba(37, 99, 235, 0.12)',
                    filter: 'blur(18px)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }}
            />
            <div
                className="hero-container"
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                <div
                    className="hero-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(320px, 0.9fr)',
                        alignItems: 'center',
                        gap: '2.5rem',
                    }}
                >
                {/* Left column */}
                <div className="hero-left" style={{ minWidth: '280px', maxWidth: '620px' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.9)',
                            border: '1px solid rgba(148, 163, 184, 0.18)',
                            borderRadius: '999px',
                            padding: '0.55rem 1rem',
                            color: '#334155',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            marginBottom: '1.4rem',
                            boxShadow: '0 6px 16px rgba(15, 23, 42, 0.05)',
                        }}
                    >
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#22C55E',
                                flexShrink: 0,
                            }}
                        />
                        Data di perbarui dari sunber terpercaya
                    </div>

                    <h1
                        style={{
                            fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)',
                            fontWeight: 800,
                            color: '#0F172A',
                            margin: 0,
                            lineHeight: 1.25,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        Pantau Keamanan Wilayah Anda,
                        <br />
                        <span style={{ color: '#2563EB' }}>Secara Real-Time.</span>
                    </h1>

                    <p
                        style={{
                            color: '#64748B',
                            marginTop: '1rem',
                            lineHeight: 1.7,
                            fontSize: '1rem',
                            maxWidth: '540px',
                        }}
                    >
                        CrimeAlert Indonesia mengumpulkan dan memverifikasi berita kriminal dari media
                        terpercaya di seluruh Indonesia, lalu menyajikannya dalam peta dan statistik yang
                        mudah dipahami.
                    </p>

                    <div
                        className="hero-search"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(255,255,255,0.95)',
                            border: '1px solid #E2E8F0',
                            borderRadius: '999px',
                            padding: '0.4rem 0.4rem 0.4rem 1.1rem',
                            marginTop: '1.6rem',
                            maxWidth: '480px',
                            boxShadow: '0 8px 20px rgba(15, 23, 42, 0.06)',
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#94A3B8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0 }}
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari Lokasi, Kota, Atau Provinsi"
                            style={{
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                flex: 1,
                                fontSize: '0.95rem',
                                color: '#0F172A',
                                minWidth: 0,
                            }}
                        />
                        <button
                            type="button"
                            style={{
                                border: 'none',
                                background: '#2563EB',
                                color: '#FFFFFF',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                padding: '0.7rem 1.5rem',
                                borderRadius: '999px',
                                cursor: 'pointer',
                                flexShrink: 0,
                            }}
                        >
                            Cari
                        </button>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            marginTop: '1.1rem',
                            fontSize: '0.9rem',
                            color: '#334155',
                            flexWrap: 'wrap',
                        }}
                    >
                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#2563EB"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>Lokasi Anda :</span>
                        <strong style={{ color: '#0F172A' }}>{userCity}</strong>
                        <Link
                            to="/map"
                            style={{
                                color: '#2563EB',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            Lihat di peta&nbsp;→
                        </Link>
                    </div>
                </div>

                {/* Right column: stat cards */}
                <div
                    className="hero-stats"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.1rem',
                        maxWidth: '520px',
                        width: '100%',
                        marginLeft: 'auto',
                    }}
                >
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            style={{
                                background: 'rgba(255,255,255,0.9)',
                                border: '1px solid rgba(226, 232, 240, 0.9)',
                                borderRadius: '18px',
                                padding: '1.3rem 1.3rem',
                                boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
                            }}
                        >
                            <div
                                style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '10px',
                                    background: s.iconBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '0.9rem',
                                }}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={s.iconColor}
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    {s.icon}
                                    {s.iconExtra}
                                </svg>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A' }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '0.15rem' }}>
                                {s.label}
                            </div>
                            {s.sub && (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.2rem',
                                        marginTop: '0.5rem',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: s.sub.color,
                                    }}
                                >
                                    <svg
                                        width="11"
                                        height="11"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={s.sub.color}
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {s.sub.direction === 'down' ? (
                                            <path d="M6 8l6 8 6-8" />
                                        ) : (
                                            <path d="M6 16l6-8 6 8" />
                                        )}
                                    </svg>
                                    {s.sub.text}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 860px) {
                    .hero-section {
                        padding: 2.25rem 1.25rem 2.5rem !important;
                    }
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        gap: 1.5rem !important;
                    }
                    .hero-stats {
                        max-width: 100% !important;
                        margin-left: 0 !important;
                    }
                }
                @media (max-width: 480px) {
                    .hero-stats {
                        grid-template-columns: 1fr 1fr !important;
                        gap: 0.75rem !important;
                    }
                    .hero-search {
                        flex-wrap: wrap;
                        border-radius: 18px !important;
                        padding: 0.6rem !important;
                    }
                    .hero-search input {
                        width: 100%;
                        order: 2;
                        padding: 0.3rem 0 !important;
                    }
                    .hero-search button {
                        order: 3;
                        width: 100%;
                    }
                }
            `}</style>
        </section>
    );
}