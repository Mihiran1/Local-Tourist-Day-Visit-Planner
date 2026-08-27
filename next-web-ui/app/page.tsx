"use client";

import { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, TextInput, Box } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import bg1 from '../assets/BG1.png';
import bg2 from '../assets/BG2.png';
import bg3 from '../assets/BG3.png';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const [bgIndex, setBgIndex] = useState(0);
  const backgrounds = [bg1.src, bg2.src, bg3.src];

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000); // තත්පර 5න් 5ට පින්තූරය මාරු වෙනවා
    return () => clearInterval(interval);
  }, [backgrounds.length]);

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
              style={{ width: '60%', minWidth: '300px' }}
              styles={{
                input: {
                  backgroundColor: 'white',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }
              }}
            />
            <Button size="xl" radius="xl" color="teal">
              Search
            </Button>
          </Group>

        </Container>
      </Box>

      {/* 3. ඊළඟට එන්න ඕනේ Attractions Grid එක... (ඒක ඊළඟ පියවරේදී හදමු) */}
      
    </div>
  );
}
