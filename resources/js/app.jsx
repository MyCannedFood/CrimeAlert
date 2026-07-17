import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './utils/DarkModeProvider';
import { CrimeLocationProvider } from './utils/CrimeLocationContext';
import Navbar from './Components/Navbar';
import Home from './Page/Home/Home';
import MapPage from './Page/Map/Map';
import News from './Page/News/News';
import Statistics from './Page/Statistics/Statistics';
import About from './Page/About/About';
import Report from './Page/Report/Report';
import ReportDetail from './Page/Report/ReportDetail';
import ArticlePage from './Page/News/ArticlePage';
import SosButton from './Components/SosButton';

function App() {
    return (
        <DarkModeProvider>
            <CrimeLocationProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/map" element={<MapPage />} />
                        <Route path="/news" element={<News />} />
                        <Route path="/laporan" element={<Report />} />
                        <Route path="/laporan/:id" element={<ReportDetail />} />
                        <Route path="/statistik" element={<Statistics />} />
                        <Route path="/tentang" element={<About />} />
                        <Route path="/berita/:id" element={<ArticlePage />} />
                    </Routes>
                    <SosButton />
                </BrowserRouter>
            </CrimeLocationProvider>
        </DarkModeProvider>
    );
}


const rootElement = document.getElementById('root');

if (rootElement) {
    createRoot(rootElement).render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
