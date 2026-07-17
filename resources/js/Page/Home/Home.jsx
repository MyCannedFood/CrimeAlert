import HeroSection from './HeroSection';
import LatestNewsSection from './LatestNewsSection';
import RiskLevelSection from './RiskLevelSection';
import NearestNewsSection from './NearestNewsSection';
import Footer from '../../Components/Footer';

export default function Home() {
    return (
        <div className="font-sans" style={{ minHeight: '100vh', background: 'var(--color-bg-secondary)' }}>
            <HeroSection />

            <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1.25rem 3rem' }}>
                {/* Use wrappers for spacing; full-bleed dividers inserted between sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }} className="home-sections">
                    <div style={{ padding: '2rem 0' }}>
                        <LatestNewsSection />
                    </div>

                    {/* Full-bleed divider between LatestNews and RiskLevel */}
                    <div
                        style={{
                            width: '100vw',
                            position: 'relative',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderTop: '1px solid var(--color-border)',
                            margin: '2rem 0',
                        }}
                    />

                    <div style={{ padding: '2rem 0' }}>
                        <RiskLevelSection />
                    </div>

                    {/* Full-bleed divider between RiskLevel and NearestNews */}
                    <div
                        style={{
                            width: '100vw',
                            position: 'relative',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            borderTop: '1px solid var(--color-border)',
                            margin: '2rem 0',
                        }}
                    />

                    <div style={{ padding: '2rem 0' }}>
                        <NearestNewsSection />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
