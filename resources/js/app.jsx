import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Page/Home/Home';
import MapPage from './Page/Map/Map';
import News from './Page/News/News';
import Statistics from './Page/Statistics/Statistics';

function App() {
    return React.createElement(
        BrowserRouter,
        null,
        React.createElement(Navbar, null),
        React.createElement(
            Routes,
            null,
            React.createElement(Route, { path: '/', element: React.createElement(Home, null) }),
            React.createElement(Route, { path: '/map', element: React.createElement(MapPage, null) }),
            React.createElement(Route, { path: '/news', element: React.createElement(News, null) }),
            React.createElement(Route, { path: '/statistik', element: React.createElement(Statistics, null) })
        )
    );
}

const rootElement = document.getElementById('root');

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        React.createElement(React.StrictMode, null, React.createElement(App, null))
    );
}
