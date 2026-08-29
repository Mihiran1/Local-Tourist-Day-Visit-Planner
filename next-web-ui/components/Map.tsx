"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Map.module.css';

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
    <div class="${styles.customIconWrapper}">
      <div class="${styles.customIconDot} ${isSelected ? styles.customIconDotSelected : ''}"></div>
      <span class="${styles.customIconLabel}">${name}</span>
    </div>
  `,
  iconAnchor: [isSelected ? 13 : 8, isSelected ? 13 : 8]
});

// Special Marigold Center Marker (Dehiattakandiya)
const centerIcon = new L.DivIcon({
  className: 'center-leaflet-marker',
  html: `<div class="${styles.centerIconDot}"></div>`,
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
  centerMarker,
  onMarkerClick,
  routePositions
}: MapProps) {
  
  const selectedMarkerData = selectedMarkerId 
    ? markers.find(m => m.id === selectedMarkerId) 
    : undefined;

  return (
    <div className={styles.mapWrapper}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        doubleClickZoom={interactive}
        className={styles.mapContainer}
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
                <div className={styles.tooltipContainer}>
                  {marker.image && (
                    <img src={marker.image} alt={marker.name} className={styles.tooltipImage} />
                  )}
                  <strong className={styles.tooltipTitle}>{marker.name}</strong>
                  {marker.category && (
                    <span className={styles.tooltipCategory}>
                      {marker.category}
                    </span>
                  )}
                  {marker.distanceText && (
                    <span className={styles.tooltipDistance}>
                      {marker.distanceText}
                    </span>
                  )}
                </div>
              </Tooltip>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}