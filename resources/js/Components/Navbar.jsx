import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Peta', path: '/map' },
    { name: 'Berita', path: '/news' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'Tentang', path: '/tentang' },
];

export default function Navbar() {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }

        return location.pathname.startsWith(path);
    };

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
            }}
        >
            <div
                style={{
                    maxWidth: '1180px',
                    margin: '0 auto',
                    padding: '0.9rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Link
                    to="/"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        textDecoration: 'none',
                    }}
                >
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 24px rgba(37, 99, 235, 0.24)',
                        }}
                    >
                        <svg width="22" height="24" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 1.5L21.5 5V13C21.5 19 17.5 23.5 12 26.5C6.5 23.5 2.5 19 2.5 13V5L12 1.5Z"
                                stroke="#ffffff"
                                strokeWidth="2"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                        <span
                            style={{
                                fontSize: '1.05rem',
                                fontWeight: 800,
                                color: '#0f172a',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            CrimeAlert
                        </span>
                        <span
                            style={{
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                color: '#64748b',
                            }}
                        >
                            Indonesia
                        </span>
                    </div>
                </Link>

                <div className="navbar-desktop-items" style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: active ? '#2563eb' : '#475569',
                                    fontWeight: active ? 700 : 600,
                                    fontSize: '0.95rem',
                                    padding: '0.6rem 0.9rem',
                                    borderRadius: '999px',
                                    background: active ? '#eff6ff' : 'transparent',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <button
                    className="navbar-hamburger"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        display: 'none',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        padding: '0.55rem',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
                    }}
                    aria-label="Toggle menu"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2">
                        {isOpen ? (
                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                        ) : (
                            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                        )}
                    </svg>
                </button>
            </div>

            {isOpen && (
                <div
                    className="navbar-mobile-items"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.3rem',
                        padding: '0 1rem 1rem',
                        maxWidth: '1180px',
                        margin: '0 auto',
                    }}
                >
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                style={{
                                    textDecoration: 'none',
                                    color: active ? '#2563eb' : '#334155',
                                    fontWeight: 700,
                                    padding: '0.7rem 0.85rem',
                                    borderRadius: '12px',
                                    background: active ? '#eff6ff' : '#f8fafc',
                                    border: active ? '1px solid #bfdbfe' : '1px solid transparent',
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .navbar-desktop-items {
                        display: none !important;
                    }
                    .navbar-hamburger {
                        display: block !important;
                    }
                }
            `}</style>
        </nav>
    );
}