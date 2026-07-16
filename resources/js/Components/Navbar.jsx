import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Map', path: '/map' },
    { name: 'News', path: '/news' },
    { name: 'Statistik', path: '/statistik' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <nav
            style={{
                background: '#ffffff',
                borderBottom: '1px solid #e5e7eb',
                padding: '1rem 1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                }}
            >
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive ? '#2563eb' : '#374151',
                                fontWeight: 700,
                                padding: '0.5rem 0.8rem',
                                borderRadius: '999px',
                                background: isActive ? '#dbeafe' : 'transparent',
                            }}
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
