"use client";

import { Container, Grid, Paper, Title, Text, Button, Group, Checkbox, Stack, Table, Image, ActionIcon, Flex, Badge } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { IconPlus, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import api from '../../../services/api';
import { useEffect, useState } from 'react';

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

export default function AttractionsListPage() {
  const router = useRouter();

  const [attractions, setAttractions] = useState<Attraction[]>([]);

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

  const rows = attractions.map((element) => {
    const firstImage = element.imageUrls && element.imageUrls.length > 0 
      ? `http://localhost:8080${element.imageUrls[0]}` 
      : 'https://placehold.co/50';

    return (
      <Table.Tr key={element.id}>
        <Table.Td><Checkbox color="green.9" /></Table.Td>
        
        <Table.Td>
          <Group gap="sm">
            <Image src={firstImage} w={40} h={40} radius="md" fit="cover" />
            <Text fw={500} size="sm">{element.name}</Text>
          </Group>
        </Table.Td>
        
        <Table.Td><Text size="sm" c="dimmed">{element.category}</Text></Table.Td>
        <Table.Td><Text size="sm" c="dimmed">{element.distance}</Text></Table.Td>
        
        <Table.Td><Text size="sm" fw={500}>{element.openingTime || 'N/A'}</Text></Table.Td>
        
        <Table.Td>
          <Flex gap="xs">
            <ActionIcon variant="light" color="blue"><IconEye size={16} /></ActionIcon>
            <ActionIcon variant="light" color="yellow" onClick={() => router.push(`/admin/attractions/${element.id}/edit`)}>
              <IconEdit size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="red" onClick={async () => {
              if (confirm('Are you sure you want to delete this attraction?')) {
                try {
                  await api.delete(`/admin/attractions/${element.id}`);
                  setAttractions(attractions.filter(a => a.id !== element.id));
                } catch(e) {
                  console.error(e);
                  alert('Error deleting attraction');
                }
              }
            }}><IconTrash size={16} /></ActionIcon>
          </Flex>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Container fluid py="md" px="lg">
      
      {/* තිරය කොටස් 2කට කඩන Grid එක */}
      <Grid>
        
        {/* 1. වම් පැත්ත: Filters Column එක (කෑලි 3ක ඉඩක් ගන්නවා) */}
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper withBorder p="md" radius="md" bg="white">
            <Group justify="space-between" mb="lg">
              <Title order={5}>Filters</Title>
              <Text size="xs" c="blue" style={{ cursor: 'pointer' }}>Clear All</Text>
            </Group>
            {/* Category Filter එක */}
            <Text fw={600} size="sm" mb="sm" c="dimmed" tt="uppercase">Category</Text>
            <Stack gap="sm">
              <Checkbox label="Nature & Wildlife" color="green.9" />
              <Checkbox label="Religious & Sacred" color="green.9" />
              <Checkbox label="Heritage Sites" color="green.9" />
              <Checkbox label="Cultural" color="green.9" />
              <Checkbox label="Adventure" color="green.9" />
            </Stack>
            {/* Location Filter එක (දැනට Distance එක පාවිච්චි කරමු) */}
            <Text fw={600} size="sm" mt="xl" mb="sm" c="dimmed" tt="uppercase">Location / Distance</Text>
            <Stack gap="sm">
              <Checkbox label="Polonnaruwa" color="green.9" />
              <Checkbox label="Mahiyanganaya" color="green.9" />
              <Checkbox label="Badulla" color="green.9" />
            </Stack>
            {/* Apply Button එක */}
            <Button color="green.9" fullWidth mt="xl">
              Apply Filters
            </Button>
          </Paper>
        </Grid.Col>


        {/* 2. දකුණු පැත්ත: Table Column එක (කෑලි 9ක ඉඩක් ගන්නවා) */}
        <Grid.Col span={{ base: 12, md: 9 }}>
          <Paper withBorder p="md" radius="md" bg="white">
            
            {/* Table එකට උඩින් තියෙන Title එකයි Button එකයි */}
            <Group justify="space-between" mb="lg">
              <div>
                <Title order={3}>All Attractions</Title>
                <Text size="sm" c="dimmed">Manage all your travel destinations here</Text>
              </div>
              <Button 
                color="green.9" 
                leftSection={<IconPlus size={16} />}
                onClick={() => router.push('/admin/attractions/new')}
              >
                Add Attraction
              </Button>
            </Group>

            <Table verticalSpacing="sm" striped highlightOnHover withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th><Checkbox color="green.9" /></Table.Th>
                  <Table.Th>Attraction</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Location</Table.Th>
                  <Table.Th>Opening Time</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.length > 0 ? rows : (
                  <Table.Tr>
                    <Table.Td colSpan={6} ta="center">No attractions found.</Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

          </Paper>
        </Grid.Col>

      </Grid>

    </Container>
  );
}
