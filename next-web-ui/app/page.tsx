"use client";

import { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, TextInput, Box, SimpleGrid, Card, Image, Badge, ActionIcon, Flex } from '@mantine/core';
import { IconSearch, IconMapPin, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';
import api from '../services/api';
import bg1 from '../assets/BG1.png';
import bg2 from '../assets/BG2.png';
import bg3 from '../assets/BG3.png';
import Navbar from '../components/Navbar';

interface Attraction {
  id: number;
  name: string;
  category: string;
  description: string;
  distance: string;
  imageUrls: string[]; 
}

export default function HomePage() {
  const [bgIndex, setBgIndex] = useState(0);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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

  const filteredAttractions = attractions.filter((attraction) => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          attraction.distance.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? attraction.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* 1. අපි අලුතින් හදපු Navbar එක මෙතනින් දානවා */}
      <Navbar />

      {/* 2. Hero Section එක (ලොකු පින්තූරය තියෙන කොටස) */}
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
        {/* Smooth Animated Backgrounds */}
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

          {/* Search Bar එක */}
          <Group justify="center">
            <TextInput
              size="xl"
              radius="xl"
              placeholder="Search for places, parks, temples..."
              leftSection={<IconSearch size={24} style={{ opacity: 0.6 }} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ width: '60%', minWidth: '300px' }}
              styles={{
                input: {
                  backgroundColor: 'white',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            />
            <Button 
              size="xl" 
              radius="xl" 
              color="teal"
              onClick={() => document.getElementById('attractions-grid')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Search
            </Button>
          </Group>

        </Container>
      </Box>

      {/* 3. Attractions Grid එක */}
      <Container size="xl" py={60} id="attractions-grid">
        <Title order={2} ta="center" mb="sm" fw={800} size="2.5rem">
          Top Destinations in Dehiattakandiya
        </Title>
        <Text c="dimmed" ta="center" mb={40} mx="auto" maw={600}>
          Explore our handpicked selection of the most beautiful and culturally significant places around Dehiattakandiya.
        </Text>

        {/* Category Filters */}
        <Group justify="center" mb={50}>
          <Button 
            variant={selectedCategory === null ? 'filled' : 'light'} 
            color="teal" 
            radius="xl"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {['Nature & Wildlife', 'Religious & Sacred', 'Heritage Sites', 'Cultural', 'Adventure'].map(cat => (
            <Button 
              key={cat}
              variant={selectedCategory === cat ? 'filled' : 'light'} 
              color="teal" 
              radius="xl"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </Group>

        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
          {filteredAttractions.map((attraction) => {
            const firstImage = attraction.imageUrls && attraction.imageUrls.length > 0 
              ? `http://localhost:8080${attraction.imageUrls[0]}` 
              : 'https://placehold.co/400x250?text=No+Image';

            return (
              <Card 
                key={attraction.id} 
                shadow="sm" 
                padding="lg" 
                radius="md" 
                withBorder 
                style={{ transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--mantine-shadow-sm)';
                }}
              >
                <Card.Section >
                  <Image
                    src={firstImage}
                    height={200}
                    alt={attraction.name}
                    fit="cover"
                  />
                  <ActionIcon 
                    variant="white" 
                    color="red" 
                    radius="xl" 
                    size="lg" 
                    style={{ position: 'absolute', top: 10, right: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('Please Login to save to Favorites!'); // Mock functionality
                    }}
                  >
                    <IconHeart size={18} stroke={1.5} />
                  </ActionIcon>
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={700} size="lg" lineClamp={1}>{attraction.name}</Text>
                </Group>

                <Group gap={5} mb="md">
                  <Badge color="teal" variant="light">{attraction.category}</Badge>
                </Group>

                <Flex align="center" gap={5} c="dimmed" mb="md">
                  <IconMapPin size={16} />
                  <Text size="sm">{attraction.distance}</Text>
                </Flex>

                <Text size="sm" c="dimmed" lineClamp={3} style={{ flex: 1 }}>
                  {attraction.description}
                </Text>

                <Button 
                  component={Link} 
                  href={`/attractions/${attraction.id}`} 
                  color="teal" 
                  fullWidth 
                  mt="md" 
                  radius="md"
                >
                  View Details
                </Button>
              </Card>
            );
          })}
        </SimpleGrid>
      </Container>
    </div>
  );
}
