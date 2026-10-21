"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';

// Leaflet's default marker icons can fail to load in Next.js.
// As a workaround, we load the marker images directly from a CDN.
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
}

// This component places a map marker wherever the user clicks on the map.
function LocationMarker({ position, onChange }: { position: [number, number] | null, onChange: (lat: number, lng: number) => void }) {
  
  // useMapEvents allows us to listen for interactions (such as clicks) inside the map.
  const map = useMapEvents({
    click(e) {
      // When the user clicks anywhere on the map, emit the latitude and longitude via onChange.
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  // When a new position is provided, smoothly pan the map to that location.
  useEffect(() => {
    if (position) {
      const timeoutId = setTimeout(() => {
        try {
          map.flyTo(position, map.getZoom());
        } catch {
          try {
            map.setView(position, map.getZoom());
          } catch { /* ignore */ }
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [position, map]);

  // Only render the marker if a position has been set.
  return position === null ? null : (
    <Marker position={position} icon={icon} />
  );
}

// This is the main Map component that gets used in forms.
export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  // Use a ref to track client-side mount without triggering setState-in-effect lint errors
  const mountedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Guard against double-invocation in React Strict Mode
    if (!mountedRef.current) {
      mountedRef.current = true;
      setIsClient(true);
    }
  }, []);

  // Default center coordinates (Dehiattakandiya area, Sri Lanka)
  const defaultCenter: [number, number] = [7.6667, 81.0333];
  
  const position: [number, number] | null = 
    (latitude && longitude) ? [latitude, longitude] : null;

  if (!isClient) {
    return <div style={{ height: '400px', width: '100%', borderRadius: '8px', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>;
  }

  return (
    // MapContainer renders the full interactive map
    <MapContainer 
      center={position || defaultCenter} 
      zoom={12} 
      style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 1 }}
    >
      {/* TileLayer loads the actual map tiles (roads, buildings, etc.) from OpenStreetMap */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Render the LocationMarker component defined above */}
      <LocationMarker position={position} onChange={onChange} />
    </MapContainer>
  );
}
