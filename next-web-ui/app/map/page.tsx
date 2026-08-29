"use client";

import { useEffect, useState } from 'react';
import { Box, Text, Group, Title, ScrollArea, Flex, ActionIcon, Badge, TextInput } from '@mantine/core';
import dynamic from 'next/dynamic';
import { IconArrowLeft, IconMapPin, IconSearch, IconLocation } from '@tabler/icons-react';
import Link from 'next/link';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

const MapComponent = dynamic(() => import('../../components/Map'), { 
  ssr: false, 
  loading: () => <Box h="100%" w="100%" display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}><Text>Loading interactive map...</Text></Box> 
});

interface Attraction {
  id: number;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distance: string; // from backend, but we'll calculate exact for sorting
  imageUrls: string[];
}

// Center of Dehiattakandiya (matched with OpenStreetMap town center)
const CENTER_LAT = 7.6715;
const CENTER_LNG = 81.0409;

// Haversine distance calculation
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI/180);
  const dLon = (lon2 - lon1) * (Math.PI/180);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function MapPage() {
  const [attractions, setAttractions] = useState<(Attraction & { calculatedDistance: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await api.get('/attractions');
        const data: Attraction[] = response.data;
        
        // Calculate distance from center for all items and sort them
        const withDistance = data.filter(a => a.latitude && a.longitude).map(a => {
          const dist = getDistanceKm(CENTER_LAT, CENTER_LNG, a.latitude, a.longitude);
          return { ...a, calculatedDistance: dist };
        });
        
        withDistance.sort((a, b) => a.calculatedDistance - b.calculatedDistance);
        setAttractions(withDistance);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttractions();
  }, []);

  // Fetch real road route from OSRM when a location is selected
  useEffect(() => {
    if (!selectedId) {
      setRoutePositions([]);
      return;
    }
    
    const selectedAttraction = attractions.find(a => a.id === selectedId);
    if (selectedAttraction && selectedAttraction.latitude && selectedAttraction.longitude) {
      const fetchRoute = async () => {
        try {
          const url = `https://router.project-osrm.org/route/v1/driving/${CENTER_LNG},${CENTER_LAT};${selectedAttraction.longitude},${selectedAttraction.latitude}?geometries=geojson&overview=full`;
          const res = await fetch(url);
          const data = await res.json();
          if (data && data.routes && data.routes.length > 0) {
            // OSRM returns [lon, lat], Leaflet needs [lat, lon]
            const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
            setRoutePositions(coords);
          }
        } catch (error) {
          console.error("Error fetching route from OSRM:", error);
          // Fallback to straight line if API fails
          setRoutePositions([[CENTER_LAT, CENTER_LNG], [selectedAttraction.latitude, selectedAttraction.longitude]]);
        }
      };
      fetchRoute();
    }
  }, [selectedId, attractions]);

  const markers = attractions.map(a => ({
    id: a.id,
    lat: a.latitude,
    lng: a.longitude,
    name: a.name,
    image: a.imageUrls && a.imageUrls.length > 0 ? `http://localhost:8080${a.imageUrls[0]}` : undefined,
    category: a.category,
    distanceText: a.calculatedDistance < 1 
      ? `${Math.round(a.calculatedDistance * 1000)} m away` 
      : `${a.calculatedDistance.toFixed(1)} km away`,
  }));

  const filteredAttractions = attractions.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Flex direction="column" h="100vh" style={{ overflow: 'hidden' }}>
      <Navbar />
      
      <Flex flex={1} style={{ overflow: 'hidden' }}>
        
        {/* Left Sidebar - List View */}
        <Box w={{ base: '100%', md: 400 }} h="100%" bg="white" style={{ borderRight: '1px solid #eaeaea', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          
          {/* Sidebar Header */}
          <Box p="md" style={{ borderBottom: '1px solid #eaeaea' }}>
            <Group mb="md">
              <ActionIcon component={Link} href="/" variant="subtle" color="dark">
                <IconArrowLeft size={20} />
              </ActionIcon>
              <Box>
                <Title order={3}>Explore Map</Title>
                <Text size="xs" c="dimmed">Centered around Dehiattakandiya</Text>
              </Box>
            </Group>
            
            <TextInput 
              placeholder="Search places..." 
              leftSection={<IconSearch size={16} />}
              radius="xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
            />
          </Box>

          {/* List Area */}
          <ScrollArea flex={1} p="md">
            {loading ? (
              <Text ta="center" mt="xl" c="dimmed">Loading places...</Text>
            ) : filteredAttractions.length === 0 ? (
              <Text ta="center" mt="xl" c="dimmed">No places found.</Text>
            ) : (
              <Flex direction="column" gap="sm">
                {/* Always show the Center Reference */}
                <Box 
                  p="md" 
                  style={{ 
                    borderRadius: '8px', 
                    border: '1px solid #ffe8e6', 
                    backgroundColor: '#fff5f5', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => setSelectedId(null)}
                >
                  <Group gap="sm" wrap="nowrap">
                    <ActionIcon color="red" variant="light" size="lg" radius="xl">
                      <IconLocation size={20} />
                    </ActionIcon>
                    <Box>
                      <Text fw={700} size="sm" c="red.9">Dehiattakandiya Center</Text>
                      <Text size="xs" c="red.7">Your base location</Text>
                    </Box>
                  </Group>
                </Box>

                {/* Attraction List */}
                {filteredAttractions.map(attr => (
                  <Box 
                    key={attr.id} 
                    p="sm" 
                    style={{ 
                      borderRadius: '8px', 
                      border: selectedId === attr.id ? '2px solid var(--mantine-primary-color-filled)' : '1px solid #eaeaea', 
                      backgroundColor: selectedId === attr.id ? '#f3fcf6' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onClick={() => setSelectedId(attr.id)}
                  >
                    <Group gap="sm" wrap="nowrap">
                      {attr.imageUrls && attr.imageUrls.length > 0 ? (
                        <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                          <img src={`http://localhost:8080${attr.imageUrls[0]}`} alt={attr.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <ActionIcon variant="light" size={60} radius="md">
                          <IconMapPin size={24} />
                        </ActionIcon>
                      )}
                      
                      <Box style={{ flex: 1, overflow: 'hidden' }}>
                        <Text fw={600} size="sm" lineClamp={1}>{attr.name}</Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>{attr.category}</Text>
                        <Group gap={4} mt={4}>
                          <Badge size="xs" variant="light" color="gray">
                            {attr.calculatedDistance < 1 
                              ? `${Math.round(attr.calculatedDistance * 1000)} m` 
                              : `${attr.calculatedDistance.toFixed(1)} km`} away
                          </Badge>
                        </Group>
                      </Box>
                    </Group>
                  </Box>
                ))}
              </Flex>
            )}
          </ScrollArea>
        </Box>

        {/* Right Map Area */}
        <Box flex={1} h="100%" pos="relative" display={{ base: 'none', md: 'block' }}>
          <MapComponent 
            interactive={true} 
            zoom={11} 
            markers={markers}
            selectedMarkerId={selectedId}
            centerMarker={{ lat: CENTER_LAT, lng: CENTER_LNG, name: 'Dehiattakandiya Center' }}
            onMarkerClick={(id) => setSelectedId(id)}
            routePositions={routePositions}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
