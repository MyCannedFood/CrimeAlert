import { Link } from 'react-router-dom';

const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Peta', path: '/map' },
    { name: 'Berita', path: '/news' },
    { name: 'Statistik', path: '/statistik' },
    { name: 'Tentang', path: '/tentang' },
];

const socialLinks = [
    { name: 'Youtube', url: 'https://youtube.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'Facebook', url: 'https://facebook.com' },
    { name: 'Twitter', url: 'https://twitter.com' },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer
            style={{
                background: '#ffffff',
                borderTop: '1px solid rgba(15, 23, 42, 0.08)',
            }}
        >
            <div
                className="footer-container"
                style={{
                    maxWidth: '1180px',
                    margin: '0 auto',
                    padding: '3rem 1.25rem 2rem',
                    display: 'grid',
                    gridTemplateColumns: '1.6fr 1fr 1fr',
                    gap: '2rem',
                }}
            >
                {/* Brand */}
                <div>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            textDecoration: 'none',
                            marginBottom: '1rem',
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
                                flexShrink: 0,
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

                    <p
                        style={{
                            fontSize: '0.9rem',
                            color: '#64748b',
                            lineHeight: 1.6,
                            maxWidth: '320px',
                            margin: 0,
                        }}
                    >
                        Platform pemantauan dan agregasi berita kriminal terpercaya untuk masyarakat Indonesia.
                    </p>
                </div>

                {/* Navigasi */}
                <div>
                    <h4
                        style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            margin: '0 0 1.1rem',
                        }}
                    >
                        Navigasi
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {navLinks.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    textDecoration: 'none',
                                    color: '#64748b',
                                    fontSize: '0.9rem',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Social Media */}
                <div>
                    <h4
                        style={{
                            fontSize: '0.95rem',
                            fontWeight: 700,
                            color: '#0f172a',
                            margin: '0 0 1.1rem',
                        }}
                    >
                        Social Media
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    textDecoration: 'none',
                                    color: '#64748b',
                                    fontSize: '0.9rem',
                                    transition: 'color 0.2s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#2563eb')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div
                style={{
                    borderTop: '1px solid rgba(15, 23, 42, 0.08)',
                }}
            >
                <div
                    className="footer-bottom"
                    style={{
                        maxWidth: '1180px',
                        margin: '0 auto',
                        padding: '1.5rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <p
                        className="footer-copyright"
                        style={{
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#334155',
                            margin: 0,
                            lineHeight: 1.5,
                        }}
                    >
                        {`\u00A9 ${year} CrimeAlert Indonesia. Seluruh hak cipta dilindungi.`}
                    </p>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    .footer-bottom {
                        flex-direction: column !important;
                        align-items: flex-start !important;
                    }
                }
            `}</style>
        </footer>
    );
}