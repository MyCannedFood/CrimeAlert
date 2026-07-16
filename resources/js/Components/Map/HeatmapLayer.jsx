import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export default function HeatmapLayer({ points = [], options = {} }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.2: '#22C55E',
        0.5: '#FACC15',
        0.8: '#F97316',
        1.0: '#DC2626',
      },
      ...options,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);

  return null;
}
