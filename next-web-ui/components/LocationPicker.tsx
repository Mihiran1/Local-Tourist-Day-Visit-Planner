"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// Leaflet වල සාමාන්‍ය Marker (Pin එක) Next.js එක්ක දාද්දි සමහර වෙලාවට පෙන්නන්නේ නෑ.
// ඒකට විසඳුමක් විදියට අපි ඒ පින්තූර අන්තර්ජාලයෙන් (CDN එකකින්) කෙලින්ම ගන්නවා.
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

// මේක තමයි Map එක උඩ Click කරද්දි Pin එක එතනට වැටෙන්න හදන Component එක.
function LocationMarker({ position, onChange }: { position: [number, number] | null, onChange: (lat: number, lng: number) => void }) {
  
  // useMapEvents කියන්නේ Map එක ඇතුලේ වෙන දේවල් (Click කරන ඒවා වගේ) අල්ලගන්න පුළුවන් ක්‍රමයක්.
  const map = useMapEvents({
    click(e) {
      // කවුරු හරි Map එකේ කොතන හරි Click කරපු ගමන්, ඒ තැන Latitude එකයි Longitude එකයි අපි onChange එකෙන් එළියට යවනවා.
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  // අපි අලුතින් තැනක් දුන්නොත්, Map එක ඔටෝම ඒ තැනට යනවා.
  useEffect(() => {
    if (position) {
      const timeoutId = setTimeout(() => {
        try {
          map.flyTo(position, map.getZoom());
        } catch (e) {
          try {
            map.setView(position, map.getZoom());
          } catch (e2) {}
        }
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [position, map]);

  // දැනට තැනක් (position) තියෙනවා නම් විතරක් Pin එක පෙන්නනවා.
  return position === null ? null : (
    <Marker position={position} icon={icon} />
  );
}

// මේක තමයි ප්‍රධාන Map Component එක. මේක තමයි අපි Form එකට දාන්නේ.
export default function LocationPicker({ latitude, longitude, onChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // දෙහිඅත්තකණ්ඩිය ප්‍රදේශයේ ඛණ්ඩාංක (Default Center)
  const defaultCenter: [number, number] = [7.6667, 81.0333];
  
  const position: [number, number] | null = 
    (latitude && longitude) ? [latitude, longitude] : null;

  if (!mounted) {
    return <div style={{ height: '400px', width: '100%', borderRadius: '8px', backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>;
  }

  return (
    // MapContainer එකෙන් තමයි සම්පූර්ණ Map එක හැදෙන්නේ
    <MapContainer 
      center={position || defaultCenter} 
      zoom={12} 
      style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 1 }}
    >
      {/* TileLayer එකෙන් තමයි පාරවල් ගස් කොළන් තියෙන ඇත්ත Map පින්තූර ටික ගෙනල්ලා පෙන්නන්නේ (OpenStreetMap එකෙන්) */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* අර උඩ හදපු Marker කෑල්ල */}
      <LocationMarker position={position} onChange={onChange} />
    </MapContainer>
  );
}
