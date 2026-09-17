"use client";

import { Container, Title, Text, Box, Grid, Image, ThemeIcon, List, Flex, Button } from '@mantine/core';
import { IconMapPin, IconCalendarEvent, IconRoute, IconInfoCircle, IconArrowRight } from '@tabler/icons-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />

      {/* Header Section */}
      <Box 
        py={100} 
        style={{ 
          textAlign: 'center', 
          color: 'white',
          background: 'linear-gradient(135deg, var(--mantine-color-darkGreen-9) 0%, var(--mantine-color-darkGreen-8) 50%, var(--mantine-color-darkGreen-7) 100%)',
          boxShadow: 'inset 0 -10px 20px -10px rgba(0,0,0,0.2)'
        }}
      >
        <Container size="md">
          <Title order={1} size="3.5rem" fw={900} mb="sm" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            About Dehiattakandiya
          </Title>
          <Text size="xl" opacity={0.9} fw={500} style={{ textShadow: '0 1px 5px rgba(0,0,0,0.1)' }}>
            The Hidden Gem of the Mahaweli System C
          </Text>
        </Container>
      </Box>

      <Container size="lg" py={60}>
        <Grid gap="xl" align="center">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Title order={2} fw={800} mb="md" c="darkGreen.9">
              A City Born from the Mahaweli River
            </Title>
            <Text c="dimmed" size="lg" mb="md" style={{ lineHeight: 1.6 }}>
              Dehiattakandiya is a prominent town located in the Ampara District of Sri Lanka, forming a major part of the Mahaweli System C development project. Established to support agricultural expansion and settlements, the city is a unique blend of modern agricultural planning and deep historical roots.
            </Text>
            <Text c="dimmed" size="lg" mb="xl" style={{ lineHeight: 1.6 }}>
              Surrounded by lush green paddy fields, wildlife-rich national parks, and ancient Buddhist heritage sites, Dehiattakandiya offers visitors a glimpse into both the natural beauty and the cultural richness of rural Sri Lanka. It serves as a gateway to exploring the Maduru Oya National Park and several significant archaeological sites hidden in the eastern province.
            </Text>

            <List
              spacing="sm"
              size="md"
              icon={
                <ThemeIcon size={24} radius="xl" color="teal">
                  <IconMapPin size={14} />
                </ThemeIcon>
              }
            >
              <List.Item>Bordering the famous Maduru Oya National Park</List.Item>
              <List.Item>Rich in agricultural heritage and vast paddy fields</List.Item>
              <List.Item>Home to ancient temples like Kudagala and Henanigala</List.Item>
            </List>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Flex direction="column" gap="md">
              <Image 
                src="/dak1.jpeg" 
                alt="Dehiattakandiya Landscape" 
                radius="md" 
                h={250}
                style={{ boxShadow: 'var(--mantine-shadow-md)', objectFit: 'cover' }}
              />
              <Image 
                src="/dak2.jpeg" 
                alt="Dehiattakandiya Nature" 
                radius="md" 
                h={250}
                style={{ boxShadow: 'var(--mantine-shadow-md)', objectFit: 'cover' }}
              />
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      {/* App Information Section */}
      <Box bg="gray.0" py={80}>
        <Container size="lg">
          <Box ta="center" mb={50}>
            <Title order={2} fw={800} c="darkGreen.9" mb="md">
              About This Platform
            </Title>
            <Text c="dimmed" size="lg" maw={700} mx="auto">
              Our Local Travel Day Visit Planner is designed to help you discover the best of Dehiattakandiya effortlessly. Whether you are a nature lover, a history enthusiast, or just looking for a peaceful getaway, our platform makes planning your trip simple and exciting.
            </Text>
          </Box>

          <Grid gap="xl">
            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Flex direction="column" align="center" ta="center">
                <ThemeIcon size={60} radius="xl" color="teal" variant="light" mb="md">
                  <IconInfoCircle size={30} />
                </ThemeIcon>
                <Title order={3} size="h4" mb="sm">Discover Places</Title>
                <Text c="dimmed">
                  Explore a curated list of attractions including wildlife parks, historical temples, and natural viewpoints, all complete with detailed descriptions and images.
                </Text>
              </Flex>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Flex direction="column" align="center" ta="center">
                <ThemeIcon size={60} radius="xl" color="teal" variant="light" mb="md">
                  <IconRoute size={30} />
                </ThemeIcon>
                <Title order={3} size="h4" mb="sm">Interactive Map</Title>
                <Text c="dimmed">
                  Use our interactive map view to see exactly where each attraction is located relative to the city center, and find the actual driving routes.
                </Text>
              </Flex>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 4 }}>
              <Flex direction="column" align="center" ta="center">
                <ThemeIcon size={60} radius="xl" color="teal" variant="light" mb="md">
                  <IconCalendarEvent size={30} />
                </ThemeIcon>
                <Title order={3} size="h4" mb="sm">Plan Your Visit</Title>
                <Text c="dimmed">
                  Create an account to save your favorite destinations and build your own custom day-visit plan to make the most out of your trip to Dehiattakandiya.
                </Text>
              </Flex>
            </Grid.Col>
          </Grid>

          <Box ta="center" mt={50}>
            <Button 
              component={Link} 
              href="/attractions" 
              size="lg" 
              radius="xl" 
              color="darkGreen.8"
              rightSection={<IconArrowRight size={18} />}
            >
              Start Exploring Now
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </div>
  );
}
