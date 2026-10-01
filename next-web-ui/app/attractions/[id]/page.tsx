"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container, Title, Text, Button, Group, Box, Image, Grid, Paper, Badge, ThemeIcon, List, ActionIcon, Flex, SimpleGrid, Modal } from '@mantine/core';
import { IconMapPin, IconClock, IconBulb, IconHeart, IconArrowLeft, IconPhoto } from '@tabler/icons-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import api from '../../../services/api';
import Navbar from '../../../components/Navbar';
import { useTripPlan } from '../../../context/TripPlanContext';


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
  const { addToPlan } = useTripPlan();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [openedImage, setOpenedImage] = useState<string | null>(null);

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

  const formatWithBoldSubtopics = (text: string) => {
    if (!text) return '';
    let formatted = text;

    // Bold any text before a colon (e.g. "Best time: Morning")
    formatted = formatted.replace(/^(\s*(?:-\s+|\*\s+|\d+\.\s+)?)([^:*_\n]{2,60}):/gm, '$1**$2**:');
    
    // Bold any text before a hyphen (e.g. "1. Photo - Take photos")
    formatted = formatted.replace(/^(\s*(?:-\s+|\*\s+|\d+\.\s+)?)([^:*_\-\n]{2,60})\s+-\s+/gm, '$1**$2** - ');

    // Bold any text before a period in a list item (e.g. "1. Scenic Photography. The view is...")
    formatted = formatted.replace(/^(\s*(?:-\s+|\*\s+|\d+\.\s+))([^:*_\.\n]{2,60})\.(?=\s|$)/gm, '$1**$2**.');

    // Bold entire short list items with no trailing punctuation
    formatted = formatted.replace(/^(\s*(?:-\s+|\*\s+|\d+\.\s+))([^:*_\.\n]{2,60})$/gm, '$1**$2**');

    // Convert manual or auto-added markdown bold that has trailing/leading spaces (e.g. "** Text **" -> "**Text**")
    formatted = formatted.replace(/\*\*\s*(.*?)\s*\*\*/g, '**$1**');

    // Convert emoji headers and standalone bold lines to Markdown H3 for better UX
    formatted = formatted
      .split('\n')
      .map(line => {
        let trimmed = line.trim();
        
        // If it's already an H3, leave it
        if (trimmed.startsWith('### ')) return line;

        // If it's a standalone bold line, convert to H3
        if (trimmed.match(/^\*\*(.*?)\*\*$/)) {
          return trimmed.replace(/^\*\*(.*?)\*\*$/, '### $1');
        }

        // If it's a numbered bold line (e.g. "1. **Header**"), convert to H3
        const listMatch = trimmed.match(/^(\d+\.\s+)\*\*(.*?)\*\*$/);
        if (listMatch) {
          return `### ${listMatch[1]}${listMatch[2]}`;
        }

        // If it's an emoji line, convert to H3
        if (!trimmed.includes('**') && !trimmed.startsWith('-') && !trimmed.match(/^\d+\./) && trimmed.length <= 80) {
          if (/[\uD800-\uDFFF\u2600-\u27BF]/.test(trimmed) && !trimmed.endsWith('.')) {
            return `### ${trimmed}`;
          }
        }
        
        return line;
      })
      .join('  \n');

    return formatted;
  };

  const formatTravelTips = (text: string) => {
    if (!text) return '';
    const bulleted = text
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
          return trimmed;
        }
        return `- ${trimmed}`;
      })
      .join('\n');
    return formatWithBoldSubtopics(bulleted);
  };

  const heroImage = attraction.imageUrls && attraction.imageUrls.length > 0 
    ? `http://localhost:8080${encodeURI(attraction.imageUrls[0])}` 
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
              color="darkGreen.9" 
              size="lg" 
              radius="md" 
              leftSection={<IconHeart size={20} />}
              onClick={() => {
                addToPlan({
                  id: attraction.id,
                  name: attraction.name,
                  category: attraction.category,
                  imageUrl: heroImage,
                  lat: attraction.latitude,
                  lng: attraction.longitude
                });
              }}
            >
              Add to Plan
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
              <div className="markdown-content">
                <ReactMarkdown>{formatWithBoldSubtopics(attraction.description)}</ReactMarkdown>
              </div>
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
                  <div className="markdown-content-sm">
                    <ReactMarkdown>
                      {formatTravelTips(attraction.travelTips)}
                    </ReactMarkdown>
                  </div>
                </Paper>
              )}
            </Box>
          </Grid.Col>
        </Grid>

        {/* Prominent Photo Gallery Section */}
        {attraction.imageUrls && attraction.imageUrls.length > 1 && (
          <Box mt={60} mb={40}>
            <Title order={2} fw={800} mb="lg">Photo Gallery</Title>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
              {attraction.imageUrls.slice(1).map((img, idx) => (
                <Image 
                  key={idx}
                  src={`http://localhost:8080${encodeURI(img)}`}
                  height={250}
                  radius="xl"
                  fit="cover"
                  style={{ 
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                  className="gallery-img"
                  onClick={() => setOpenedImage(img)}
                />
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Global style for gallery hover effect */}
        <style jsx global>{`
          .gallery-img:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 25px rgba(0,0,0,0.15) !important;
            cursor: pointer;
          }
          
          /* Markdown Styles */
          .markdown-content, .markdown-content-sm {
            color: #333;
          }
          .markdown-content {
            line-height: 1.8;
            font-size: 1.05rem;
          }
          .markdown-content-sm {
            line-height: 1.6;
            font-size: 1rem;
            color: #4a5568;
          }
          .markdown-content h1, .markdown-content h2, .markdown-content h3, 
          .markdown-content-sm h1, .markdown-content-sm h2, .markdown-content-sm h3 {
            margin-top: 1.8em;
            margin-bottom: 0.6em;
            color: #2c3e50;
            font-size: 1.25rem;
            font-weight: 700;
          }
          .markdown-content p, .markdown-content-sm p {
            margin-bottom: 1.2em;
          }
          .markdown-content ul, .markdown-content-sm ul {
            padding-left: 1.5em;
            margin-bottom: 1.5em;
          }
          .markdown-content li, .markdown-content-sm li {
            margin-bottom: 0.85em;
          }
        `}</style>
      </Container>

      {/* Lightbox Modal */}
      <Modal 
        opened={!!openedImage} 
        onClose={() => setOpenedImage(null)} 
        size="auto" 
        centered
        padding={0}
        withCloseButton={false}
      >
        {openedImage && (
          <Image 
            src={`http://localhost:8080${encodeURI(openedImage)}`} 
            style={{ maxHeight: '90vh', maxWidth: '100vw', objectFit: 'contain' }} 
            onClick={() => setOpenedImage(null)}
          />
        )}
      </Modal>
    </div>
  );
}
