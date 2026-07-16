import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { useDarkMode } from '../utils/DarkModeProvider';

const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Peta', path: '/map' },
    { name: 'Berita', path: '/news' },
    { name: 'Laporan', path: '/laporan' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'Tentang', path: '/tentang' },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { isDark, toggle } = useDarkMode();
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        let mounted = true;
        let cleanup = () => {};

        const syncAuth = async () => {
            if (!supabase) {
                if (mounted) setAuthLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!mounted) return;

            setUser(session?.user ?? null);
            setAuthLoading(false);

            const { data: authData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
                if (!mounted) return;
                setUser(nextSession?.user ?? null);
                if (_event === 'SIGNED_IN') navigate('/', { replace: true });
            });

            cleanup = () => authData.subscription.unsubscribe();
        };

        syncAuth();
        return () => { mounted = false; cleanup(); };
    }, [navigate]);

    const handleAuthClick = async () => {
        if (authLoading) return;

        if (!supabase) {
            setAuthError('Supabase belum dikonfigurasi dengan benar. Periksa URL dan anon key Anda.');
            return;
        }

        if (user) {
            setAuthError('');
            await supabase.auth.signOut();
            setUser(null);
            navigate('/', { replace: true });
            return;
        }

        setAuthError('');
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/` },
        });

        if (error) {
            const friendlyMessage = error?.message?.includes('provider is not enabled')
                ? 'Google belum diaktifkan sebagai provider auth di Supabase Dashboard.'
                : error?.message || 'Login gagal. Coba lagi.';
            setAuthError(friendlyMessage);
            console.error('Supabase auth error:', error);
        }
    };

    const isActive = (path) => {
        if (path === '/') return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <nav
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                background: 'var(--color-navbar-bg)',
                backdropFilter: 'blur(14px)',
                borderBottom: '1px solid var(--color-border)',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
            }}
        >
            <div
                className="navbar-container"
                style={{
                    maxWidth: '1180px',
                    margin: '0 auto',
                    padding: '0.9rem 1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <Link
                    to="/"
                    className="navbar-logo"
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
                                color: 'var(--color-text)',
                                letterSpacing: '-0.02em',
                            }}
                        >
                            CrimeAlert
                        </span>
                        <span
                            style={{
                                fontSize: '0.72rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text-secondary)',
                            }}
                        >
                            Indonesia
                        </span>
                    </div>
                </Link>

                <div
                    className="navbar-desktop-items"
                    style={{
                        display: 'flex',
                        gap: '0.45rem',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: active ? '#2563eb' : 'var(--color-text-secondary)',
                                    fontWeight: active ? 700 : 600,
                                    fontSize: '0.95rem',
                                    padding: '0.6rem 0.9rem',
                                    borderRadius: '999px',
                                    background: active ? 'var(--color-bg-secondary)' : 'transparent',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div
                    className="navbar-right"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        justifySelf: 'end',
                    }}
                >
                    <div
                        className="navbar-auth-buttons"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                        }}
                    >
                        <button
                            onClick={toggle}
                            aria-label="Toggle dark mode"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '36px',
                                height: '36px',
                                borderRadius: '999px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg)',
                                cursor: 'pointer',
                                color: 'var(--color-text-secondary)',
                                transition: 'all 0.2s ease',
                                flexShrink: 0,
                            }}
                        >
                            {isDark ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={handleAuthClick}
                            disabled={authLoading}
                            style={{
                                textDecoration: 'none',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                padding: '0.62rem 1.15rem',
                                borderRadius: '999px',
                                color: user ? 'var(--color-text)' : '#ffffff',
                                background: user ? 'var(--color-bg-card)' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                border: user ? '1px solid var(--color-border)' : 'none',
                                boxShadow: user ? 'none' : '0 10px 24px rgba(37, 99, 235, 0.24)',
                                whiteSpace: 'nowrap',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {authLoading ? '...' : (user ? 'Keluar' : 'Masuk')}
                        </button>
                    </div>

                    <button
                        className="navbar-hamburger"
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            display: 'none',
                            background: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '999px',
                            cursor: 'pointer',
                            padding: '0.55rem',
                            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
                        }}
                        aria-label="Toggle menu"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-text)' }}>
                            {isOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                            ) : (
                                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {authError && (
                <div
                    style={{
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.8rem',
                        color: '#dc2626',
                        background: '#fef2f2',
                        textAlign: 'center',
                        borderBottom: '1px solid #fecaca',
                    }}
                >
                    {authError}
                </div>
            )}

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
                                    color: active ? '#2563eb' : 'var(--color-text)',
                                    fontWeight: 700,
                                    padding: '0.7rem 0.85rem',
                                    borderRadius: '12px',
                                    background: active ? 'var(--color-bg-secondary)' : 'var(--color-bg-card)',
                                    border: '1px solid var(--color-border)',
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}

                    <div
                        style={{
                            display: 'flex',
                            gap: '0.5rem',
                            marginTop: '0.4rem',
                            paddingTop: '0.6rem',
                            borderTop: '1px solid var(--color-border)',
                        }}
                    >
                        <button
                            onClick={toggle}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                flex: 1,
                                color: 'var(--color-text)',
                                fontWeight: 700,
                                padding: '0.7rem 0.85rem',
                                borderRadius: '12px',
                                background: 'var(--color-bg-card)',
                                border: '1px solid var(--color-border)',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                            }}
                        >
                            {isDark ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                                </svg>
                            )}
                            {isDark ? 'Mode Terang' : 'Mode Gelap'}
                        </button>
                        <button
                            onClick={handleAuthClick}
                            disabled={authLoading}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                textDecoration: 'none',
                                color: user ? 'var(--color-text)' : '#ffffff',
                                fontWeight: 700,
                                padding: '0.7rem 0.85rem',
                                borderRadius: '12px',
                                background: user ? 'var(--color-bg-card)' : 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                border: user ? '1px solid var(--color-border)' : 'none',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                            }}
                        >
                            {authLoading ? '...' : (user ? 'Keluar' : 'Masuk')}
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .navbar-desktop-items {
                        display: none !important;
                    }
                    .navbar-auth-buttons {
                        display: none !important;
                    }
                    .navbar-hamburger {
                        display: block !important;
                    }
                    .navbar-container {
                        grid-template-columns: auto auto !important;
                        justify-content: space-between !important;
                    }
                }
                @media (min-width: 769px) {
                    .navbar-logo {
                        margin-left: -1.5rem;
                    }
                }
                .navbar-auth-buttons button:last-child:hover {
                    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.32);
                    transform: translateY(-1px);
                }
            `}</style>
        </nav>
    );
}
