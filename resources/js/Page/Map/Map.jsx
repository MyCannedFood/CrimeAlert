import React from 'react';

export default function MapPage() {
    return React.createElement(
        'div',
        { style: { minHeight: '100vh', background: '#fff', padding: '2rem' } },
        React.createElement('h1', { style: { fontSize: '2rem', fontWeight: 700 } }, 'Map'),
        React.createElement('p', { style: { marginTop: '0.5rem', color: '#555' } }, 'Halaman Map')
    );
}
