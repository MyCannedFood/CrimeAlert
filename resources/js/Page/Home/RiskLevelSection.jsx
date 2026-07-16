import { useState } from 'react';
import MiniMap from '../../Components/Map/MiniMap';

const LEGEND = [
    { label: 'Aman', color: '#22C55E' },
    { label: 'Sedang', color: '#EAB308' },
    { label: 'Tinggi', color: '#F97316' },
    { label: 'Bahaya', color: '#EF4444' },
];

function MapIcon() {
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
            <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" strokeLinejoin="round" />
            <path d="M9 4v14M15 6v14" />
        </svg>
    );
}

// Consistent edge padding, matching LatestNewsSection / NearestNewsSection.
const EDGE_PADDING = 'clamp(1.25rem, 4vw, 3rem)';

export default function RiskLevelSection() {
    return (
        <section
            style={{
                marginBottom: '2rem',
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            <div
                style={{
                    width: '100vw',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
            <div
                className="risk-header"
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
                        <MapIcon />
                        Peta Interaktif
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
                        Tingkat Kerawanan Indonesia
                    </h2>
                    <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem', maxWidth: '520px' }}>
                        Pratinjau peta panas kriminalitas seluruh Indonesia. Klik link di kanan untuk membuka peta interaktif lengkap.
                    </p>
                </div>
                <a
                    href="/map"
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
                    Lihat Peta <span style={{ fontSize: '1rem' }}>{'\u2192'}</span>
                </a>
            </div>

            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(15, 23, 42, 0.05)',
                    marginLeft: EDGE_PADDING,
                    marginRight: EDGE_PADDING,
                }}
            >
                <div style={{ position: 'relative', width: '100%' }}>
                    <MiniMap height="400px" showHeatmap={true} interactive={false} />
                </div>

                <div
                    className="risk-legend"
                    style={{
                        borderTop: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.25rem',
                        rowGap: '0.5rem',
                    }}
                >
                    {LEGEND.map((item) => (
                        <div
                            key={item.label}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontSize: '0.88rem',
                                color: '#334155',
                            }}
                        >
                            <span
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    background: item.color,
                                    display: 'inline-block',
                                    flexShrink: 0,
                                }}
                            />
                            {item.label}
                        </div>
                    ))}
                </div>
            </div>
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .risk-header h2 {
                        font-size: 1.6rem !important;
                    }
                    .risk-legend {
                        gap: 1rem !important;
                        padding: 0.85rem 1rem !important;
                    }
                }
            `}</style>
        </section>
    );
}