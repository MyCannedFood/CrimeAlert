import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';

const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Peta', path: '/map' },
    { name: 'Berita', path: '/news' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'Tentang', path: '/tentang' },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }

        return location.pathname.startsWith(path);
    };

    useEffect(() => {
        let mounted = true;
        let cleanup = () => {};

        const syncAuth = async () => {
            if (!supabase) {
                if (mounted) {
                    setAuthLoading(false);
                }
                return;
            }

            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!mounted) return;

            setUser(session?.user ?? null);
            setAuthLoading(false);

            const { data: authData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
                if (!mounted) return;
                setUser(nextSession?.user ?? null);

                if (_event === 'SIGNED_IN') {
                    navigate('/', { replace: true });
                }
            });

            cleanup = () => authData.subscription.unsubscribe();
        };

        syncAuth();

        return () => {
            mounted = false;
            cleanup();
        };
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
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });

        if (error) {
            const friendlyMessage = error?.message?.includes('provider is not enabled')
                ? 'Google belum diaktifkan sebagai provider auth di Supabase Dashboard. Buka Authentication > Providers > Google lalu aktifkan.'
                : error?.message || 'Login gagal. Coba lagi.';

            setAuthError(friendlyMessage);
            console.error('Supabase auth error:', error);
        }
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
                                    color: active ? '#2563eb' : '#475569',
                                    fontWeight: active ? 700 : 600,
                                    fontSize: '0.95rem',
                                    padding: '0.6rem 0.9rem',
                                    borderRadius: '999px',
                                    background: active ? '#eff6ff' : 'transparent',
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
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '0.35rem',
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleAuthClick}
                            disabled={authLoading}
                            style={{
                                border: 'none',
                                cursor: authLoading ? 'wait' : 'pointer',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                padding: '0.62rem 1.15rem',
                                borderRadius: '999px',
                                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                boxShadow: '0 10px 24px rgba(37, 99, 235, 0.24)',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {authLoading ? 'Memuat...' : user ? 'Logout' : 'Masuk'}
                        </button>
                        {authError ? (
                            <span
                                style={{
                                    maxWidth: '240px',
                                    fontSize: '0.7rem',
                                    lineHeight: 1.4,
                                    color: '#dc2626',
                                    textAlign: 'right',
                                }}
                            >
                                {authError}
                            </span>
                        ) : null}
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

                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            marginTop: '0.4rem',
                            paddingTop: '0.6rem',
                            borderTop: '1px solid rgba(15, 23, 42, 0.08)',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false);
                                handleAuthClick();
                            }}
                            style={{
                                flex: 1,
                                textAlign: 'center',
                                border: 'none',
                                color: '#ffffff',
                                fontWeight: 700,
                                padding: '0.7rem 0.85rem',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                                cursor: authLoading ? 'wait' : 'pointer',
                            }}
                        >
                            {authLoading ? 'Memuat...' : user ? 'Logout' : 'Masuk'}
                        </button>
                        {authError ? (
                            <span
                                style={{
                                    fontSize: '0.78rem',
                                    lineHeight: 1.4,
                                    color: '#dc2626',
                                }}
                            >
                                {authError}
                            </span>
                        ) : null}
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
                .navbar-auth-buttons button:hover {
                    box-shadow: 0 14px 28px rgba(37, 99, 235, 0.32);
                    transform: translateY(-1px);
                }
            `}</style>
        </nav>
    );
}