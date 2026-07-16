import { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';

export default function MapEventHandler({ onBoundsChange }) {
  const map = useMapEvents({
    moveend() {
      if (onBoundsChange) {
        onBoundsChange(map.getBounds());
      }
    },
    zoomend() {
      if (onBoundsChange) {
        onBoundsChange(map.getBounds());
      }
    },
  });

  useEffect(() => {
    if (onBoundsChange && map) {
      onBoundsChange(map.getBounds());
    }
  }, [map]);

  return null;
}
