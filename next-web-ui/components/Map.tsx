"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  markers: Array<{
    id: number;
    lat: number;
    lng: number;
    name: string;
    image?: string;
    category?: string;
    distanceText?: string;
  }>;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  selectedMarkerId?: number | null;
  centerMarker?: { lat: number; lng: number; name: string };
  onMarkerClick?: (id: number) => void;
  routePositions?: [number, number][];
}

// Dynamic Icon Generator for Attractions
const createCustomIcon = (name: string, isSelected: boolean) => new L.DivIcon({
  className: 'custom-leaflet-marker-with-label',
  html: `
    <div style="display: flex; align-items: center; gap: 8px; width: max-content; pointer-events: none;">
      <div style="
        background: radial-gradient(circle at 35% 35%, #16A398, #0E6E68);
        border: ${isSelected ? '4px' : '3px'} solid #FFFFFF;
        width: ${isSelected ? '26px' : '16px'};
        height: ${isSelected ? '26px' : '16px'};
        border-radius: 50%;
        box-shadow: 0 0 0 ${isSelected ? '6px' : '0px'} rgba(14,110,104,0.18), 0 2px 6px rgba(0,0,0,0.35);
        transition: all 0.2s ease;
        pointer-events: auto;
      "></div>
      <span style="
        background: #FFFFFF; 
        padding: 3px 10px; 
        border-radius: 999px; 
        font-weight: 600; 
        font-size: 12px; 
        font-family: 'Inter', sans-serif;
        box-shadow: 0 2px 6px rgba(34,48,31,0.18); 
        color: #0E6E68;
        border: 1px solid #E4F1EC;
        pointer-events: auto;
      ">${name}</span>
    </div>
  `,
  iconAnchor: [isSelected ? 13 : 8, isSelected ? 13 : 8]
});

// Special Marigold Center Marker (Dehiattakandiya)
const centerIcon = new L.DivIcon({
  className: 'center-leaflet-marker',
  html: `<div style="
    background: radial-gradient(circle at 35% 35%, #F0A055, #E2872F);
    border: 4px solid #FFFFFF;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    box-shadow: 0 0 0 6px rgba(226, 135, 47, 0.22), 0 2px 8px rgba(0,0,0,0.35);
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

function MapController({ 
  center, 
  zoom, 
  selectedMarker 
}: { 
  center: [number, number], 
  zoom: number, 
  selectedMarker?: {lat: number, lng: number} 
}) {
  const map = useMap();
  useEffect(() => {
    if (selectedMarker) {
      map.flyTo([selectedMarker.lat, selectedMarker.lng], 14, { duration: 1.5 });
    } else {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, selectedMarker, map]);
  return null;
}

export default function Map({ 
  markers, 
  center = [7.6715, 81.0409], 
  zoom = 11, 
  interactive = true,
  selectedMarkerId = null,
  centerMarker = null,
  onMarkerClick,
  routePositions
}: MapProps) {
  
  const selectedMarkerData = selectedMarkerId 
    ? markers.find(m => m.id === selectedMarkerId) 
    : undefined;

  return (
    <div style={{ height: '100%', width: '100%', zIndex: 0, position: 'relative' }}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
        style={{ height: '100%', width: '100%', zIndex: 1, backgroundColor: '#EFEAD9' }}
      >
        <MapController 
          center={center} 
          zoom={zoom} 
          selectedMarker={selectedMarkerData} 
        />
        
        {/* OpenStreetMap (Street View) */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Center Marker (e.g. Dehiattakandiya) without Tooltip to avoid duplicate OSM label */}
        {centerMarker && (
          <Marker position={[centerMarker.lat, centerMarker.lng]} icon={centerIcon} />
        )}

        {/* Route Line from Center to Selected Marker */}
        {routePositions && routePositions.length > 0 && (
          <Polyline 
            positions={routePositions}
            pathOptions={{ color: '#0E6E68', weight: 5, opacity: 0.85, dashArray: '1, 10', lineCap: 'round' }}
          />
        )}

        {/* Attraction Markers */}
        {markers.map(marker => (
          marker.lat && marker.lng ? (
            <Marker 
              key={marker.id} 
              position={[marker.lat, marker.lng]} 
              icon={createCustomIcon(marker.name, marker.id === selectedMarkerId)}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(marker.id)
              }}
            >
              {/* Detailed Hover Tooltip */}
              <Tooltip direction="top" offset={[0, -16]} opacity={1} permanent={false}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '210px', padding: '6px', fontFamily: "'Inter', sans-serif" }}>
                  {marker.image && (
                    <img src={marker.image} alt={marker.name} style={{ width: '100%', height: '104px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                  <strong style={{ fontSize: '14px', color: '#22301F', fontFamily: "'Fraunces', serif", fontWeight: 600 }}>{marker.name}</strong>
                  {marker.category && (
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 600,
                      color: '#0E6E68', 
                      backgroundColor: '#E4F1EC', 
                      padding: '2px 8px', 
                      borderRadius: '999px', 
                      width: 'fit-content' 
                    }}>
                      {marker.category}
                    </span>
                  )}
                  {marker.distanceText && (
                    <span style={{ 
                      fontSize: '11px', 
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      backgroundColor: '#FCEEDD', 
                      color: '#B8621B',
                      padding: '3px 8px', 
                      borderRadius: '999px', 
                      width: 'fit-content', 
                      marginTop: '2px'
                    }}>
                      {marker.distanceText}
                    </span>
                  )}
                </div>
              </Tooltip>
            </Marker>
          ) : null
        ))}
      </MapContainer>

      {/* Global styles for the tooltip override */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

        .leaflet-tile-pane {
          filter: sepia(6%) saturate(108%) brightness(1.01);
        }
        .leaflet-tooltip {
          background-color: #FFFFFF !important;
          border: 1px solid #E4F1EC !important;
          border-radius: 12px !important;
          padding: 8px !important;
          box-shadow: 0 10px 24px rgba(34, 48, 31, 0.16) !important;
          white-space: normal !important;
        }
        .leaflet-tooltip-top:before {
          border-top-color: #FFFFFF !important;
        }
        .leaflet-control-zoom a {
          color: #0E6E68 !important;
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}