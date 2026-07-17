import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import HeatmapLayer from './HeatmapLayer';
import { api } from '../../utils/api';
import { useDarkMode } from '../../utils/DarkModeProvider';

export default function MiniMap({
  height,
  center = [-2.5489, 118.0149],
  zoom = 5,
  showHeatmap = true,
  interactive = false,
  className = '',
  crimes: propCrimes = null,
}) {
  const { isDark } = useDarkMode();
  const [mapInstance, setMapInstance] = useState(null);
  const [dataReady, setDataReady] = useState(false);
  const [fetchedCrimes, setFetchedCrimes] = useState([]);
  const [containerSize, setContainerSize] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (propCrimes) {
      setDataReady(true);
      return;
    }
    api.crimes.list()
      .then((data) => {
        setFetchedCrimes(data || []);
        setDataReady(true);
      })
      .catch(() => {
        setFetchedCrimes([]);
        setDataReady(true);
      })
  }, [propCrimes]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setContainerSize(`${Math.round(width)}x${Math.round(height)}`);
          if (mapInstance) {
            mapInstance.invalidateSize();
          }
        }
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mapInstance]);

  const crimes = propCrimes || fetchedCrimes;

  const heatmapPoints = useMemo(() => {
    const intensityMap = { safe: 0.3, moderate: 0.6, high: 0.8, danger: 1.0 };
    return crimes.map((c) => [
      c.latitude,
      c.longitude,
      intensityMap[c.severity] || 0.5,
    ]);
  }, [crimes]);

  const handleMapReady = useCallback((map) => {
    setMapInstance(map);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={height ? { height } : undefined}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        style={{ width: '100%', height: '100%', minHeight: height || 250 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url={isDark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
        />
        <MapController onReady={handleMapReady} />
        {showHeatmap && mapInstance && dataReady && heatmapPoints.length > 0 && (
          <HeatmapLayer key={containerSize} points={heatmapPoints} />
        )}
      </MapContainer>
    </div>
  );
}

function MapController({ onReady }) {
  const map = useMap();
  useEffect(() => {
    let cancelled = false;
    const fire = () => {
      if (cancelled) return;
      map.invalidateSize();
      onReady(map);
    };
    const mapContainer = map.getContainer();
    const checkSize = () => {
      if (cancelled) return;
      const rect = mapContainer.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        fire();
      } else {
        requestAnimationFrame(checkSize);
      }
    };
    checkSize();
    return () => { cancelled = true; };
  }, [map, onReady]);
  return null;
}
