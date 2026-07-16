import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import HeatmapLayer from './HeatmapLayer';
import { api } from '../../utils/api';

export default function MiniMap({
  height = '400px',
  center = [-2.5489, 118.0149],
  zoom = 5,
  showHeatmap = true,
  interactive = false,
  className = '',
  crimes: propCrimes = null,
}) {
  const [fetchedCrimes, setFetchedCrimes] = useState([]);

  useEffect(() => {
    if (propCrimes) return;
    api.crimes.list()
      .then((data) => setFetchedCrimes(data || []))
      .catch(() => setFetchedCrimes([]))
  }, [propCrimes]);

  const crimes = propCrimes || fetchedCrimes;

  const heatmapPoints = useMemo(() => {
    const intensityMap = { safe: 0.3, moderate: 0.6, high: 0.8, danger: 1.0 };
    return crimes.map((c) => [
      c.latitude,
      c.longitude,
      intensityMap[c.severity] || 0.5,
    ]);
  }, [crimes]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={{ height }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={interactive}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showHeatmap && <HeatmapLayer points={heatmapPoints} />}
      </MapContainer>
    </div>
  );
}
