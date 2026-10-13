import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

interface LocationPickerMapProps {
  lat: number;
  lng: number;
  onChange: (coords: { lat: number; lng: number }) => void;
  height?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  lat,
  lng,
  onChange,
  height = '300px'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = lat || 18.5204;
      const initialLng = lng || 73.8567;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 11
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const markerIcon = L.divIcon({
        className: 'picker-marker',
        html: `
          <div style="
            background: #059669;
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
          ">
            <span style="transform: rotate(45deg); font-size: 14px;">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: markerIcon
      }).addTo(map);

      marker.on('dragend', () => {
        const position = marker.getLatLng();
        onChange({ lat: Number(position.lat.toFixed(5)), lng: Number(position.lng.toFixed(5)) });
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        marker.setLatLng(e.latlng);
        onChange({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) });
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      const current = markerRef.current.getLatLng();
      if (Math.abs(current.lat - lat) > 0.0001 || Math.abs(current.lng - lng) > 0.0001) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
      }
    }
  }, [lat, lng]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="flex items-center gap-1 font-medium text-stone-700">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Click or drag pin to set farm coordinates
        </span>
        <span>
          Lat: {lat?.toFixed(4)}, Lng: {lng?.toFixed(4)}
        </span>
      </div>
      <div className="rounded-xl overflow-hidden border border-stone-200 shadow-inner">
        <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      </div>
    </div>
  );
};
