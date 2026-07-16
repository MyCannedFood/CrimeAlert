import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DarkModeProvider } from './utils/DarkModeProvider';
import Navbar from './Components/Navbar';
import Home from './Page/Home/Home';
import MapPage from './Page/Map/Map';
import News from './Page/News/News';
import Statistics from './Page/Statistics/Statistics';
import About from './Page/About/About';
import Report from './Page/Report/Report';
import ReportDetail from './Page/Report/ReportDetail';

function App() {
    return (
        <DarkModeProvider>
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
                </Routes>
            </BrowserRouter>
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
