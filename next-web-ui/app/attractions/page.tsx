"use client";

import { useState, useEffect, Suspense } from 'react';
import { Container, Title, Text, Button, Group, TextInput, SimpleGrid, Card, Image, Badge, ActionIcon, Flex, Box } from '@mantine/core';
import { IconSearch, IconMapPin, IconHeart } from '@tabler/icons-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

interface Attraction {
  id: number;
  name: string;
  category: string;
  description: string;
  distance: string;
  imageUrls: string[]; 
}

function AttractionsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || null;

  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);

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

  const uniqueCategories = Array.from(new Set(attractions.map(a => a.category).filter(Boolean)));

  const filteredAttractions = attractions.filter((attraction) => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          attraction.distance.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? attraction.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />

      {/* Header Section */}
      <Box bg="darkGreen.9" py={60} style={{ textAlign: 'center', color: 'white' }}>
        <Container size="md">
          <Title order={1} size="3rem" fw={900} mb="sm">
            Discover All Destinations
          </Title>
          <Text size="lg" opacity={0.8} mb="xl">
            Find the perfect place for your next adventure in Dehiattakandiya.
          </Text>
          <TextInput
            size="xl"
            radius="xl"
            placeholder="Search for places, parks, temples..."
            leftSection={<IconSearch size={24} style={{ opacity: 0.6 }} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ width: '80%', margin: '0 auto', maxWidth: '600px' }}
            styles={{
              input: {
                backgroundColor: 'white',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
          />
        </Container>
      </Box>

      {/* Attractions Grid */}
      <Container fluid px={{ base: 'md', lg: 150 }} py={40}>
        
        {/* Category Filters */}
        <Group justify="center" mb={50}>
          <Button 
            variant={selectedCategory === null ? 'filled' : 'light'} 
            radius="xl"
            onClick={() => setSelectedCategory(null)}
          >
            All Places
          </Button>
          {uniqueCategories.map(cat => (
            <Button 
              key={cat}
              variant={selectedCategory === cat ? 'filled' : 'light'} 
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
                <Card.Section>
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
                      alert('Please Login to save to Favorites!');
                    }}
                  >
                    <IconHeart size={18} stroke={1.5} />
                  </ActionIcon>
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={700} size="lg" lineClamp={1}>{attraction.name}</Text>
                </Group>

                <Group gap={5} mb="md">
                  <Badge variant="light">{attraction.category}</Badge>
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

        {filteredAttractions.length === 0 && (
          <Box ta="center" py="xl">
            <Text c="dimmed" size="lg">No attractions found matching your search.</Text>
          </Box>
        )}
      </Container>
    </div>
  );
}

export default function AttractionsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AttractionsContent />
    </Suspense>
  );
}
