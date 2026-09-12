"use client";

import { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, TextInput, Box, SimpleGrid, Card, Badge, Flex, Grid, ThemeIcon, List, Paper, Timeline } from '@mantine/core';
import { IconSearch, IconMapPin, IconArrowRight, IconPlus, IconTree, IconBuildingChurch, IconBuildingMonument, IconMasksTheater, IconTrekking, IconInfoCircle, IconCalendarEvent, IconCirclePlus, IconClock, IconBookmark } from '@tabler/icons-react';
import Link from 'next/link';
import { useTripPlan } from '../context/TripPlanContext';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '../services/api';
import bg1 from '../assets/BG1.png';
import bg2 from '../assets/BG2.png';
import bg3 from '../assets/BG3.png';

const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });
import Navbar from '../components/Navbar';

interface Attraction {
  id: number;
  name: string;
  category: string;
  description: string;
  distance: string;
  latitude: number;
  longitude: number;
  imageUrls: string[]; 
}

export default function HomePage() {
  const [bgIndex, setBgIndex] = useState(0);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { addToPlan } = useTripPlan();
  
  const backgrounds = [bg1.src, bg2.src, bg3.src];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await api.get('/attractions');
        setAttractions(response.data);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    };
    fetchAttractions();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/attractions?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/attractions');
    }
  };

  // Get only first 4 for Popular Places
  const popularAttractions = attractions.slice(0, 4);

  const categoryData = [
    { name: 'Nature & Wildlife', count: 24, icon: <IconTree size={16} />, image: 'https://images.unsplash.com/photo-1613289052028-c1195a62e088?q=80&w=600&auto=format&fit=crop' },
    { name: 'Religious & Sacred', count: 18, icon: <IconBuildingChurch size={16} />, image: 'https://images.unsplash.com/photo-1549473889-14f410d83298?q=80&w=600&auto=format&fit=crop' },
    { name: 'Heritage Sites', count: 12, icon: <IconBuildingMonument size={16} />, image: 'https://images.unsplash.com/photo-1587826388487-19c6f2d25d19?q=80&w=600&auto=format&fit=crop' },
    { name: 'Cultural', count: 9, icon: <IconMasksTheater size={16} />, image: 'https://images.unsplash.com/photo-1610093674387-9ee9440bc4c4?q=80&w=600&auto=format&fit=crop' },
    { name: 'Adventure', count: 7, icon: <IconTrekking size={16} />, image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=600&auto=format&fit=crop' },
  ];

  const uniqueCategories = Array.from(new Set(attractions.map(a => a.category).filter(Boolean)));
  const realCategoryData = uniqueCategories.map(catName => {
    const count = attractions.filter(a => a.category === catName).length;
    // Find matching static data for icon and image
    const staticData = categoryData.find(c => c.name.toLowerCase() === catName.toLowerCase());
    return {
      name: catName,
      count,
      icon: staticData ? staticData.icon : <IconTree size={16} />,
      image: staticData ? staticData.image : 'https://images.unsplash.com/photo-1613289052028-c1195a62e088?q=80&w=600&auto=format&fit=crop'
    };
  });

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: '60px' }}>
      
      <Navbar />

      {/* Hero Section */}
      <Box 
        style={{
          position: 'relative',
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === bgIndex ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              zIndex: 0
            }}
          />
        ))}

        <Container size="md" style={{ textAlign: 'center', color: 'white', position: 'relative', zIndex: 1 }}>
          <Title order={1} size="4rem" fw={900} mb="md">
            Explore the Hidden Beauty of Dehiattakandiya
          </Title>
          <Text size="xl" mb="xl" c="gray.2">
            Discover breathtaking landscapes, sacred temples, and amazing wildlife in one of Sri Lanka's most beautiful destinations.
          </Text>
          <Group justify="center">
            <TextInput
              size="xl"
              radius="xl"
              placeholder="Search for places, parks, temples..."
              leftSection={<IconSearch size={24} style={{ opacity: 0.6 }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              style={{ width: '60%', minWidth: '300px' }}
              styles={{
                input: {
                  backgroundColor: 'white',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            />
            <Button size="xl" radius="xl" onClick={handleSearch}>
              Search
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Plan Your Perfect Day Trip Banner */}
      <Container fluid px={{ base: 'md', lg: 150 }} mt={80}>
        <Paper p={{ base: 'xl', md: 50 }} radius="xl" bg="darkGreen.9" c="white" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Subtle background gradient overlay for the banner */}
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
          
          <Grid align="center" gutter={40}>
            {/* Left Content */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Group gap="xs" mb="md">
                <ThemeIcon color="teal.5" variant="light" size="sm" radius="xl">
                  <IconCalendarEvent size={14} />
                </ThemeIcon>
                <Text size="sm" fw={700} c="teal.4" tt="uppercase" letterSpacing={1}>One-Day Planning</Text>
              </Group>
              <Title order={2} size="2.5rem" fw={900} mb="md" style={{ lineHeight: 1.2 }}>
                Plan Your Perfect Day Trip
              </Title>
              <Text size="md" c="gray.4" mb="xl" style={{ lineHeight: 1.6 }}>
                Create a personalized one-day itinerary. Pick attractions, see estimated times, view your route on the map and save your plan.
              </Text>
              <Group>
                <Button 
                  component={Link} 
                  href="/plan" 
                  color="teal.5" 
                  radius="xl" 
                  size="md"
                  leftSection={<IconPlus size={16} />}
                >
                  Create a Visit Plan
                </Button>
                <Button 
                  variant="outline" 
                  color="gray.4" 
                  radius="xl" 
                  size="md"
                >
                  Learn More
                </Button>
              </Group>
            </Grid.Col>

            {/* Middle Feature Cards */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <SimpleGrid cols={2} spacing="md">
                <Paper p="md" radius="md" bg="rgba(255,255,255,0.05)" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <ThemeIcon color="teal.5" variant="transparent" mb="sm"><IconSearch size={24} /></ThemeIcon>
                  <Text fw={600} size="sm" mb={4}>Discover Places</Text>
                  <Text size="xs" c="gray.5">Browse and search local attractions that interest you.</Text>
                </Paper>
                <Paper p="md" radius="md" bg="rgba(255,255,255,0.05)" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <ThemeIcon color="teal.5" variant="transparent" mb="sm"><IconCirclePlus size={24} /></ThemeIcon>
                  <Text fw={600} size="sm" mb={4}>Build Your Plan</Text>
                  <Text size="xs" c="gray.5">Add attractions to your one-day visit plan in your preferred order.</Text>
                </Paper>
                <Paper p="md" radius="md" bg="rgba(255,255,255,0.05)" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <ThemeIcon color="teal.5" variant="transparent" mb="sm"><IconClock size={24} /></ThemeIcon>
                  <Text fw={600} size="sm" mb={4}>Get a Timeline</Text>
                  <Text size="xs" c="gray.5">See estimated visit durations and travel time between places.</Text>
                </Paper>
                <Paper p="md" radius="md" bg="rgba(255,255,255,0.05)" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <ThemeIcon color="teal.5" variant="transparent" mb="sm"><IconBookmark size={24} /></ThemeIcon>
                  <Text fw={600} size="sm" mb={4}>Save & Share</Text>
                  <Text size="xs" c="gray.5">Save your plan and revisit it anytime after logging in.</Text>
                </Paper>
              </SimpleGrid>
            </Grid.Col>

            {/* Right Sample Timeline */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Paper p="lg" radius="md" bg="rgba(255,255,255,0.05)" withBorder style={{ borderColor: 'rgba(255,255,255,0.1)', height: '100%' }}>
                <Group gap="xs" mb="lg">
                  <IconClock size={16} color="var(--mantine-color-gray-4)" />
                  <Text size="sm" c="gray.4" fw={600}>Sample Timeline</Text>
                </Group>
                <Timeline active={4} bulletSize={10} lineWidth={2} color="teal.5">
                  <Timeline.Item title="09:00" styles={{ itemTitle: { fontSize: '0.8rem', color: '#fff' } }}>
                    <Text size="xs" c="gray.4" mt={2}>Kudagala Temple</Text>
                  </Timeline.Item>
                  <Timeline.Item title="11:30" styles={{ itemTitle: { fontSize: '0.8rem', color: '#fff' } }}>
                    <Text size="xs" c="gray.4" mt={2}>Maduru Oya NP</Text>
                  </Timeline.Item>
                  <Timeline.Item title="14:00" styles={{ itemTitle: { fontSize: '0.8rem', color: '#fff' } }}>
                    <Text size="xs" c="gray.4" mt={2}>Ancient Sluice</Text>
                  </Timeline.Item>
                  <Timeline.Item title="16:30" styles={{ itemTitle: { fontSize: '0.8rem', color: '#fff' } }}>
                    <Text size="xs" c="gray.4" mt={2}>Henanigala Viharaya</Text>
                  </Timeline.Item>
                </Timeline>
              </Paper>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>

      {/* Popular Places Section */}
      <Container fluid px={{ base: 'md', lg: 150 }} mt={80}>
        <Group justify="space-between" align="flex-end" mb="xl">
          <div>
            <Title order={2} fw={800} c="darkGreen.9">Popular Places</Title>
            <Text c="dimmed" mt={4}>Most-visited local attractions in this area</Text>
          </div>
          <Button 
            component={Link} 
            href="/attractions" 
            variant="transparent" 
            color="darkGreen.9" 
            rightSection={<IconArrowRight size={16} />}
            fw={600}
          >
            View All
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
          {popularAttractions.map((attraction) => {
            const firstImage = attraction.imageUrls && attraction.imageUrls.length > 0 
              ? `http://localhost:8080${attraction.imageUrls[0]}` 
              : 'https://placehold.co/400x500?text=No+Image';

            return (
              <Card 
                key={attraction.id} 
                radius="xl" 
                p={0} 
                style={{ height: '400px', overflow: 'hidden', position: 'relative' }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: `url(${firstImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%)'
                }} />
                
                <Flex direction="column" justify="space-between" h="100%" p="lg" style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                  
                  {/* Top Badges */}
                  <Group justify="space-between">
                    <Badge color="white" c="darkGreen.9" radius="xl" size="md" leftSection={<IconTree size={12} style={{ marginTop: 2 }} />}>
                      {attraction.category.split(' ')[0]}
                    </Badge>
                    <Badge color="orange" radius="xl" size="md">Popular</Badge>
                  </Group>

                  {/* Bottom Content */}
                  <div>
                    <Title order={3} size="h4" fw={700} lineClamp={1}>{attraction.name}</Title>
                    <Group gap="xs" mt={8} mb="lg" style={{ opacity: 0.9 }}>
                      <Flex align="center" gap={4}><IconMapPin size={14} /><Text size="xs">{attraction.distance.split('/')[0] || 'Dehiattakandiya'}</Text></Flex>
                      <Text size="xs">•</Text>
                      <Flex align="center" gap={4}><Text size="xs">{attraction.distance}</Text></Flex>
                    </Group>

                    <Group grow gap="xs">
                      <Button 
                        component={Link} 
                        href={`/attractions/${attraction.id}`} 
                        color="darkGreen.8" 
                        radius="xl" 
                        size="sm"
                      >
                        View Details
                      </Button>
                      <Button 
                        variant="white" 
                        c="darkGreen.9" 
                        radius="xl" 
                        size="sm"
                        leftSection={<IconPlus size={14} />}
                        onClick={(e) => {
                          e.preventDefault();
                          addToPlan({
                            id: attraction.id,
                            name: attraction.name,
                            category: attraction.category,
                            imageUrl: firstImage,
                            lat: attraction.latitude,
                            lng: attraction.longitude
                          });
                        }}
                      >
                        Add to Plan
                      </Button>
                    </Group>
                  </div>
                </Flex>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>

      {/* About Summary Section */}
      <Box bg="gray.0" py={60} mt={80}>
        <Container fluid px={{ base: 'md', lg: 150 }}>
          <Grid gap="xl" align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={2} fw={800} mb="md" c="darkGreen.9">
                Welcome to Dehiattakandiya
              </Title>
              <Text c="dimmed" size="lg" mb="md" style={{ lineHeight: 1.6 }}>
                Located in the heart of the Mahaweli System C, Dehiattakandiya is a beautiful town surrounded by lush paddy fields, ancient ruins, and rich wildlife. This application is your ultimate day-visit planner to explore the hidden gems of this region.
              </Text>
              
              <List
                spacing="sm"
                size="md"
                icon={
                  <ThemeIcon size={20} radius="xl" color="teal">
                    <IconMapPin size={12} />
                  </ThemeIcon>
                }
              >
                <List.Item>Bordering the magnificent Maduru Oya National Park</List.Item>
                <List.Item>Discover ancient temples and cultural heritage</List.Item>
                <List.Item>Plan your custom day-visit with our interactive tools</List.Item>
              </List>

              <Button 
                component={Link} 
                href="/about" 
                mt="xl" 
                radius="xl" 
                color="darkGreen.8"
                rightSection={<IconArrowRight size={16} />}
              >
                Read More About Us
              </Button>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card radius="md" p={0} shadow="md" style={{ overflow: 'hidden' }}>
                <div style={{
                  height: '350px',
                  backgroundImage: 'url(https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=800&auto=format&fit=crop)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Explore by Category Section */}
      <Container fluid px={{ base: 'md', lg: 150 }} mt={80} mb={60}>
        <Group justify="space-between" align="flex-end" mb="xl">
          <div>
            <Title order={2} fw={800} c="darkGreen.9">Explore by Category</Title>
            <Text c="dimmed" mt={4}>Find attractions that match your interests</Text>
          </div>
          <Button 
            component={Link} 
            href="/attractions" 
            variant="transparent" 
            color="darkGreen.9" 
            rightSection={<IconArrowRight size={16} />}
            fw={600}
          >
            All Categories
          </Button>
        </Group>

        {realCategoryData.length === 0 && (
          <Text c="dimmed">No categories available.</Text>
        )}

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
          {realCategoryData.map((cat, idx) => (
            <Card 
              key={idx} 
              component={Link}
              href={`/attractions?category=${encodeURIComponent(cat.name)}`}
              radius="xl" 
              p={0} 
              style={{ height: '220px', overflow: 'hidden', position: 'relative', cursor: 'pointer' }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: `url(${cat.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                transition: 'transform 0.3s ease',
              }} className="cat-img" />
              
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)'
              }} />
              
              <Flex direction="column" justify="flex-end" h="100%" p="lg" style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                <Group gap="xs" mb={4}>
                  {cat.icon}
                  <Text fw={600} size="md">{cat.name}</Text>
                </Group>
                <Text size="xs" opacity={0.7}>{cat.count} Places</Text>
              </Flex>
            </Card>
          ))}
        </SimpleGrid>

        {/* Global style for hover effect on category cards */}
        <style jsx global>{`
          .mantine-Card-root:hover .cat-img {
            transform: scale(1.1);
          }
        `}</style>
      </Container>

      {/* Explore on Map Section */}
      <Container fluid px={{ base: 'md', lg: 150 }} mb={80}>
        <Group justify="space-between" align="flex-end" mb="xl">
          <div>
            <Title order={2} fw={800}>Explore on Map</Title>
            <Text c="dimmed" mt={4}>Discover all attractions visually on a map</Text>
          </div>
          <Button 
            component={Link} 
            href="/map" 
            variant="transparent" 
            color="primary" 
            rightSection={<IconArrowRight size={16} />}
            fw={600}
          >
            Open Full Map
          </Button>
        </Group>

        <Card 
          radius="xl" 
          p={0} 
          withBorder
          style={{ height: '450px', position: 'relative', overflow: 'hidden' }}
        >
          {/* Static semi-interactive map preview */}
          <MapComponent 
            interactive={false}
            zoom={12}
            markers={[
              { id: 1, lat: 7.640, lng: 81.015, name: 'Maduru Oya NP' },
              { id: 2, lat: 7.620, lng: 81.040, name: 'Kudagala Temple' },
              { id: 3, lat: 7.630, lng: 81.080, name: 'Henanigala Temple' },
              { id: 4, lat: 7.660, lng: 81.100, name: 'Nuwaragala' },
              { id: 5, lat: 7.600, lng: 81.110, name: 'Ancient Sluice' }
            ]} 
          />
          
          {/* Bottom Overlay Gradient */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px',
            background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none',
            zIndex: 10
          }} />

          {/* Bottom Content */}
          <Flex 
            justify="space-between" 
            align="flex-end" 
            p="xl" 
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 11, pointerEvents: 'none' }}
          >
            <Box c="white">
              <Title order={3} size="h4" fw={700}>Explore Attractions on Map</Title>
              <Text size="sm" mt={5} opacity={0.9}>Browse and discover all local attractions with an interactive map view.</Text>
            </Box>
            <Button 
              component={Link}
              href="/map"
              variant="white" 
              color="dark" 
              radius="xl" 
              size="md"
              leftSection={<IconMapPin size={16} />}
              style={{ pointerEvents: 'auto' }}
            >
              Open Map
            </Button>
          </Flex>
        </Card>
      </Container>
    </div>
  );
}
