import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Pastikan L tersedia secara global untuk plugin
window.L = window.L || L;
import 'leaflet.heat';

const DEFAULT_OPTIONS = {};

export default function HeatmapLayer({ points = [], options = DEFAULT_OPTIONS }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;
    
    // Safety check in case leaflet.heat didn't load properly

    if (typeof L.heatLayer !== 'function') {
      console.error("L.heatLayer is not available. Check leaflet.heat import.");
      return;
    }

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 10,
      max: 1.0,
      minOpacity: 0.4,
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
