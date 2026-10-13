import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { User } from '../types/index.ts';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FarmMapProps {
  farmers: (User & {
    productCount?: number;
    availableProducts?: number;
    categories?: string[];
  })[];
  selectedFarmerId?: string;
  onSelectFarmer?: (farmerId: string) => void;
  height?: string;
  zoom?: number;
  center?: [number, number];
}

export const FarmMap: React.FC<FarmMapProps> = ({
  farmers,
  selectedFarmerId,
  onSelectFarmer,
  height = '480px',
  zoom = 6,
  center = [20.5937, 78.9629] // India centroid
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const navigate = useNavigate();

  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Custom Leaf Marker Icon
  const createFarmIcon = (isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-farm-marker',
      html: `
        <div style="
          background-color: ${isSelected ? '#059669' : '#10b981'};
          color: white;
          width: 38px;
          height: 38px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          border: 2px solid white;
        ">
          <svg style="transform: rotate(45deg); width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -36]
    });
  };

  // Sync Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds([]);

    farmers.forEach(farmer => {
      const loc = farmer.farmLocation;
      if (!loc || typeof loc.lat !== 'number' || typeof loc.lng !== 'number') return;

      const isSelected = farmer.id === selectedFarmerId;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createFarmIcon(isSelected)
      }).addTo(map);

      // Popup Content
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-1 font-sans';
      popupDiv.innerHTML = `
        <div style="min-width: 220px;">
          <h4 style="font-weight: 700; font-size: 15px; margin: 0 0 4px 0; color: #1c1917;">${loc.farmName || farmer.name}</h4>
          <p style="font-size: 12px; color: #57534e; margin: 0 0 6px 0;">
            ${loc.city || 'Farm Location'}, ${loc.state || 'India'}
          </p>
          <div style="display: flex; gap: 6px; font-size: 11px; margin-bottom: 8px;">
            <span style="color: #047857; font-weight: 600;">👨‍🌾 ${farmer.name}</span>
            <span>·</span>
            <span style="color: #44403c;">${farmer.productCount ?? 'Multiple'} items</span>
          </div>
          <button id="view-farmer-${farmer.id}" style="
            background: #10b981;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            width: 100%;
            cursor: pointer;
          ">
            View Fresh Produce →
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-farmer-${farmer.id}`);
        if (btn) {
          btn.onclick = () => {
            navigate(`/farmers/${farmer.id}`);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectFarmer) onSelectFarmer(farmer.id);
      });

      markersRef.current[farmer.id] = marker;
      bounds.extend([loc.lat, loc.lng]);
    });

    if (farmers.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [farmers, selectedFarmerId]);

  // Handle selected farmer focus
  useEffect(() => {
    if (!selectedFarmerId || !mapInstanceRef.current) return;
    const marker = markersRef.current[selectedFarmerId];
    if (marker) {
      marker.openPopup();
      mapInstanceRef.current.panTo(marker.getLatLng(), { animate: true });
    }
  }, [selectedFarmerId]);

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([coords.lat, coords.lng], 11, { animate: true });

          // Add user pulse marker
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div style="
                width: 18px;
                height: 18px;
                background: #3b82f6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 10px rgba(59, 130, 246, 0.7);
              "></div>
            `,
            iconSize: [18, 18],
            iconAnchor: [9, 9]
          });

          L.marker([coords.lat, coords.lng], { icon: userIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup('<b>Your Current Location</b>')
            .openPopup();
        }
      },
      err => {
        setLocating(false);
        console.warn('Geolocation permission or error:', err.message);
        // Fallback to Pune / Western India
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([18.5204, 73.8567], 9);
        }
      },
      { timeout: 7000 }
    );
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-white">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />

      {/* Floating control buttons */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        <button
          onClick={handleLocateUser}
          disabled={locating}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/95 backdrop-blur text-stone-800 text-xs font-medium rounded-lg shadow-md border border-stone-200 hover:bg-stone-50 transition-colors disabled:opacity-50"
          title="Find farms near my location"
        >
          <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${locating ? 'animate-spin' : ''}`} />
          {locating ? 'Locating...' : 'Near Me'}
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-stone-200 text-xs text-stone-600 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span>Verified Local Farm</span>
        </div>
        {userCoords && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>You</span>
          </div>
        )}
      </div>
    </div>
  );
};
