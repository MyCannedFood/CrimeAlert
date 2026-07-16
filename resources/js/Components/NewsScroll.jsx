import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

const COLORS = {
  safe: "#22C55E",
  moderate: "#FACC15",
  high: "#F97316",
  danger: "#DC2626",
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Baru saja';
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString('id-ID');
}

function severityColor(score) {
  const n = Number(score) || 0;
  if (n >= 70) return COLORS.danger;
  if (n >= 50) return COLORS.high;
  if (n >= 30) return COLORS.moderate;
  return COLORS.safe;
}

export default function NewsScroll({ title, subtitle, limit = 10 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brokenImgs, setBrokenImgs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    api.crimes.latest(limit)
      .then((data) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [limit]);

  const EDGE_PADDING = 'clamp(1.25rem, 4vw, 3rem)';

  return (
    <section style={{ marginBottom: '2rem', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <div style={{ width: '100vw', position: 'relative', left: '50%', transform: 'translateX(-50%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap', paddingLeft: EDGE_PADDING, paddingRight: EDGE_PADDING }}>
          <div>
            {title && <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.3rem 0', letterSpacing: '-0.02em' }}>{title}</h2>}
            {subtitle && <p style={{ color: '#64748B', margin: 0, fontSize: '0.95rem' }}>{subtitle}</p>}
          </div>
        </div>

        <div className="news-scroll" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', scrollSnapType: 'x proximity', paddingTop: '0.25rem', paddingBottom: '0.75rem', paddingLeft: EDGE_PADDING, paddingRight: EDGE_PADDING, WebkitOverflowScrolling: 'touch' }}>
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', flex: '0 0 auto', width: '272px', scrollSnapAlign: 'start' }}>
              <div style={{ height: '14rem', width: '100%', background: '#E2E8F0' }} />
              <div style={{ padding: '1.25rem' }}>
                <div style={{ height: '1rem', background: '#E2E8F0', borderRadius: '4px', marginBottom: '0.75rem', width: '80%' }} />
                <div style={{ height: '1rem', background: '#E2E8F0', borderRadius: '4px', width: '60%' }} />
                <div style={{ height: '0.75rem', background: '#E2E8F0', borderRadius: '4px', marginTop: '1.5rem', width: '40%' }} />
              </div>
            </div>
          ))}
          {!loading && items.length === 0 && (
            <div style={{ padding: '2rem 1rem', color: '#94A3B8', textAlign: 'center', width: '100%' }}>Belum ada berita</div>
          )}
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/berita/${item.id}`)}
              className="news-card"
              style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', flex: '0 0 auto', width: '272px', scrollSnapAlign: 'start', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'box-shadow 0.2s, transform 0.2s' }}
            >
              <div style={{ height: '14rem', width: '100%', background: '#E2E8F0', position: 'relative', flexShrink: 0, overflow: 'hidden' }}>
                {item.image_url && !brokenImgs[item.id] ? (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    onError={() => setBrokenImgs((p) => ({ ...p, [item.id]: true }))}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '13px', fontWeight: 500 }}>Gambar tidak tersedia</div>
                )}
                <div style={{ position: 'absolute', left: 0, bottom: 0, background: '#FFFFFF', padding: '0.375rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>{item.category}</div>
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '8px', height: '8px', borderRadius: '50%', background: severityColor(item.relevance_score), boxShadow: '0 0 0 2px rgba(255,255,255,0.8)' }} />
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 1.5rem 0', lineHeight: 1.2 }}>{item.title}</h3>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>
                  <span>{item.source || 'Sumber tidak diketahui'}</span>
                  <span>{timeAgo(item.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .news-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .news-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
        .news-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); transform: translateY(-2px); }
        @media (max-width: 640px) { .news-card { width: 220px !important; } .news-card > div:first-child { height: 240px !important; } }
        @media (max-width: 380px) { .news-card { width: 200px !important; } }
      `}</style>
    </section>
  );
}
