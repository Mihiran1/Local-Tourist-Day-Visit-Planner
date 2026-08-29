"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Title, Text, Button, Group, Box, Image, Grid, Paper, Badge, ThemeIcon, List, ActionIcon, Flex, SimpleGrid } from '@mantine/core';
import { IconMapPin, IconClock, IconBulb, IconHeart, IconArrowLeft, IconPhoto } from '@tabler/icons-react';
import Link from 'next/link';
import api from '../../../services/api';
import Navbar from '../../../components/Navbar';

interface Attraction {
  id: number;
  name: string;
  category: string;
  description: string;
  distance: string;
  openingTime: string;
  travelTips: string;
  latitude: number;
  longitude: number;
  imageUrls: string[]; 
}

export default function AttractionDetailsPage() {
  const params = useParams();
  const id = params.id;
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const response = await api.get(`/attractions/${id}`);
        setAttraction(response.data);
      } catch (error) {
        console.error("Error fetching attraction details:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAttraction();
  }, [id]);

  if (loading) {
    return <Box p="xl" ta="center"><Text>Loading...</Text></Box>;
  }

  if (!attraction) {
    return <Box p="xl" ta="center"><Text>Attraction not found.</Text></Box>;
  }

  const heroImage = attraction.imageUrls && attraction.imageUrls.length > 0 
    ? `http://localhost:8080${attraction.imageUrls[0]}` 
    : 'https://placehold.co/1200x500?text=No+Image';

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />

      {/* Hero Image Section */}
      <Box 
        style={{
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          alignItems: 'flex-end',
          paddingBottom: '40px'
        }}
      >
        <Container fluid px={{ base: 'md', lg: 150 }} w="100%">
          <Button 
            component={Link} 
            href="/" 
            variant="transparent" 
            c="white" 
            leftSection={<IconArrowLeft size={16} />} 
            pl={0}
            mb="md"
          >
            Back to Home
          </Button>
          <Group justify="space-between" align="flex-end">
            <div>
              <Badge size="lg" mb="sm" variant="filled">{attraction.category}</Badge>
              <Title order={1} size="3rem" c="white" fw={900}>{attraction.name}</Title>
              <Flex align="center" gap="xs" c="gray.2" mt="xs">
                <IconMapPin size={20} />
                <Text size="lg">{attraction.distance}</Text>
              </Flex>
            </div>
            <Button 
              color="red" 
              size="lg" 
              radius="md" 
              leftSection={<IconHeart size={20} />}
              onClick={() => alert("Please Login to save to Favorites!")}
            >
              Save to Favorites
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Content Section */}
      <Container fluid px={{ base: 'md', lg: 150 }} mt={40}>
        <Grid>
          {/* Main Description */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper p="xl" radius="md" shadow="sm" withBorder bg="white">
              <Title order={3} mb="md">About this place</Title>
              <Text style={{ lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                {attraction.description}
              </Text>
            </Paper>


          </Grid.Col>

          {/* Sidebar Info */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box style={{ position: 'sticky', top: '20px' }}>
              <Paper p="xl" radius="md" shadow="sm" withBorder bg="white">
                <Title order={4} mb="lg">Quick Information</Title>
                
                <List spacing="lg" size="sm" center>
                  <List.Item
                    icon={<ThemeIcon size={28} radius="xl" variant="light"><IconClock size={16} /></ThemeIcon>}
                  >
                    <Text fw={600}>Opening Hours</Text>
                    <Text c="dimmed">{attraction.openingTime || 'Always Open'}</Text>
                  </List.Item>

                  <List.Item
                    icon={<ThemeIcon color="blue" size={28} radius="xl" variant="light"><IconMapPin size={16} /></ThemeIcon>}
                  >
                    <Text fw={600}>Location</Text>
                    <Text c="dimmed">{attraction.distance}</Text>
                    {attraction.latitude && attraction.longitude && (
                      <Text size="xs" c="dimmed" mt={4}>
                        GPS: {attraction.latitude}, {attraction.longitude}
                      </Text>
                    )}
                  </List.Item>

                  <List.Item
                    icon={<ThemeIcon color="grape" size={28} radius="xl" variant="light"><IconPhoto size={16} /></ThemeIcon>}
                  >
                    <Text fw={600}>Photos</Text>
                    <Text c="dimmed">{attraction.imageUrls?.length || 0} Images available</Text>
                  </List.Item>
                </List>
              </Paper>

              {/* Travel Tips in Sidebar */}
              {attraction.travelTips && (
                <Paper p="xl" radius="md" shadow="sm" withBorder bg="white" mt="xl">
                  <Group mb="md">
                    <ThemeIcon color="yellow" size="lg" radius="xl" variant="light">
                      <IconBulb size={20} />
                    </ThemeIcon>
                    <Title order={4}>Travel Tips & Safety</Title>
                  </Group>
                  <Text style={{ lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {attraction.travelTips}
                  </Text>
                </Paper>
              )}

              {/* Photo Gallery in Sidebar */}
              {attraction.imageUrls && attraction.imageUrls.length > 1 && (
                <Paper p="xl" radius="md" shadow="sm" withBorder bg="white" mt="xl">
                  <Title order={4} mb="md">Photo Gallery</Title>
                  <SimpleGrid cols={2} spacing="md">
                    {attraction.imageUrls.slice(1).map((img, idx) => (
                      <Image 
                        key={idx}
                        src={`http://localhost:8080${img}`}
                        height={120}
                        radius="md"
                        fit="cover"
                        style={{ border: '1px solid #eaeaea' }}
                      />
                    ))}
                  </SimpleGrid>
                </Paper>
              )}
            </Box>
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  );
}
