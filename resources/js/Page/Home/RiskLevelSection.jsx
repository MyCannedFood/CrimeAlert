import { useState } from 'react';

const REGIONS = [
    {
        id: 'sumatra',
        label: 'Sumatera',
        d: 'M95,55 C130,45 150,60 165,80 C180,100 175,120 190,140 C205,160 215,175 210,195 C205,215 195,225 205,245 C215,265 225,275 220,295 C215,315 200,325 195,345 C190,365 195,380 180,390 C165,400 150,390 145,375 C140,360 150,350 140,335 C130,320 120,320 118,300 C116,280 128,270 120,255 C112,240 100,235 100,215 C100,195 112,185 105,170 C98,155 85,150 85,130 C85,110 95,100 88,85 C81,70 80,62 95,55 Z',
    },
    {
        id: 'kalimantan',
        label: 'Kalimantan',
        d: 'M355,120 C380,105 415,100 450,105 C485,110 510,100 535,115 C560,130 565,150 555,170 C545,190 555,205 545,225 C535,245 515,255 520,275 C525,295 510,310 485,308 C460,306 450,320 425,315 C400,310 390,295 370,295 C350,295 335,285 330,265 C325,245 340,235 335,215 C330,195 315,190 320,170 C325,150 335,135 355,120 Z',
    },
    {
        id: 'sulawesi',
        label: 'Sulawesi',
        d: 'M615,110 C635,105 645,120 640,135 C635,150 650,155 660,170 C670,185 685,190 690,205 C695,220 685,230 690,250 C695,270 680,280 675,300 C670,320 655,325 645,310 C635,295 645,280 630,270 C615,260 605,265 600,245 C595,225 610,220 605,200 C600,180 585,175 590,155 C595,135 600,115 615,110 Z',
    },
    {
        id: 'maluku',
        label: 'Maluku',
        d: 'M730,115 C742,110 752,118 748,130 C744,142 752,150 745,160 C738,170 726,168 722,155 C718,142 722,132 730,115 Z',
    },
    {
        id: 'maluku2',
        label: 'Maluku Utara',
        d: 'M760,150 C772,145 782,155 776,168 C770,181 778,190 768,198 C758,206 748,198 748,185 C748,172 752,160 760,150 Z',
    },
    {
        id: 'papua',
        label: 'Papua',
        d: 'M800,170 C830,160 865,165 895,175 C925,185 955,190 970,210 C985,230 975,250 960,255 C945,260 940,275 920,278 C900,281 895,295 875,290 C855,285 850,270 830,268 C810,266 800,255 795,235 C790,215 795,195 800,170 Z',
    },
    {
        id: 'java',
        label: 'Jawa',
        d: 'M255,335 C300,325 350,332 400,335 C450,338 500,330 550,336 C600,342 630,335 645,345 C650,355 635,362 610,360 C580,358 550,368 500,362 C450,356 400,362 350,358 C310,355 280,360 260,352 C248,346 248,340 255,335 Z',
    },
    {
        id: 'nusatenggara',
        label: 'Nusa Tenggara',
        d: 'M655,345 C680,340 705,348 725,344 C745,340 765,348 785,344 C805,340 825,346 840,342 C850,340 852,348 842,352 C828,357 810,352 790,356 C770,360 748,354 728,358 C706,362 682,358 660,362 C648,364 646,352 655,345 Z',
    },
    {
        id: 'bali',
        label: 'Bali',
        d: 'M636,338 C646,335 654,340 652,348 C650,356 642,358 636,352 C630,346 630,341 636,338 Z',
    },
];

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
    const [active, setActive] = useState(null);

    return (
        <section
            style={{
                marginBottom: '2rem',
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            {/* Full-bleed breakout wrapper: escapes the parent's max-width container
                so the whole section (header + card) can stretch to the real
                viewport edge, matching LatestNewsSection / NearestNewsSection. */}
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
                        Pratinjau peta panas kriminalitas seluruh Indonesia. Klik area untuk
                        melihat statistik lengkap.
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
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: '1000 / 400',
                        background: '#F8FAFC',
                    }}
                >
                    <svg
                        viewBox="0 0 1000 400"
                        width="100%"
                        height="100%"
                        style={{ display: 'block' }}
                    >
                        <defs>
                            <linearGradient id="riskHeat" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#EF4444" />
                                <stop offset="45%" stopColor="#F97316" />
                                <stop offset="100%" stopColor="#FACC15" />
                            </linearGradient>
                        </defs>
                        {REGIONS.map((r) => (
                            <path
                                key={r.id}
                                d={r.d}
                                fill="url(#riskHeat)"
                                stroke={active === r.id ? '#0F172A' : 'none'}
                                strokeWidth={active === r.id ? 1.5 : 0}
                                opacity={active && active !== r.id ? 0.55 : 1}
                                style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
                                onClick={() => setActive(active === r.id ? null : r.id)}
                            >
                                <title>{r.label}</title>
                            </path>
                        ))}
                    </svg>
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