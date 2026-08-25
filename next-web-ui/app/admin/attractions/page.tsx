"use client";

import { Container, Grid, Paper, Title, Text, Button, Group, Checkbox, Stack, Table, Image, ActionIcon, Flex, Badge, MultiSelect, Pagination, Drawer, ScrollArea, Divider } from '@mantine/core';
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [activePage, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<string[]>([]);
  const [appliedLocations, setAppliedLocations] = useState<string[]>([]);

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

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev => 
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const applyFilters = () => {
    setAppliedCategories(selectedCategories);
    setAppliedLocations(selectedLocations);
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setAppliedCategories([]);
    setAppliedLocations([]);
    setPage(1);
  };

  const filteredAttractions = attractions.filter(attraction => {
    const categoryMatch = appliedCategories.length === 0 || appliedCategories.includes(attraction.category);
    const locationMatch = appliedLocations.length === 0 || appliedLocations.some(loc => attraction.distance.toLowerCase().includes(loc.toLowerCase()));
    return categoryMatch && locationMatch;
  });

  const paginatedAttractions = filteredAttractions.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const rows = paginatedAttractions.map((element) => {
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
            <ActionIcon 
              variant="light" 
              color="blue" 
              onClick={() => {
                setSelectedAttraction(element);
                setViewModalOpen(true);
              }}
            >
              <IconEye size={16} />
            </ActionIcon>
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
      
      {/* Top Filter Section */}
      <Paper withBorder p="md" radius="md" bg="white" mb="lg">
        <Group justify="space-between" mb="sm">
          <Title order={5}>Filters</Title>
          <Group>
            <Text size="xs" c="blue" style={{ cursor: 'pointer' }} onClick={clearFilters}>Clear All</Text>
            <Button color="green.9" size="sm" onClick={applyFilters}>Apply Filters</Button>
          </Group>
        </Group>
        
        <Grid>
          <Grid.Col span={{ base: 12, lg: 7 }}>
            <Text fw={600} size="xs" mb="xs" c="dimmed" tt="uppercase">Category</Text>
            <Group gap="md">
              {['Nature & Wildlife', 'Religious & Sacred', 'Heritage Sites', 'Cultural', 'Adventure'].map(cat => (
                <Checkbox 
                  key={cat}
                  label={cat} 
                  color="green.9" 
                  size="sm" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleCategory(cat)}
                />
              ))}
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, lg: 5 }}>
            <Text fw={600} size="xs" mb="xs" c="dimmed" tt="uppercase">Location / Distance</Text>
            <Group gap="md">
              {['Polonnaruwa', 'Mahiyanganaya', 'Dehiattakandiya'].map(loc => (
                <Checkbox 
                  key={loc}
                  label={loc} 
                  color="green.9" 
                  size="sm" 
                  checked={selectedLocations.includes(loc)}
                  onChange={() => toggleLocation(loc)}
                />
              ))}
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      {/* Table Section */}
      <Paper withBorder p="md" radius="md" bg="white">
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

        {/* Pagination */}
        <Group justify="space-between" mt="md">
          <Text size="sm" c="dimmed">
            Showing {filteredAttractions.length === 0 ? 0 : (activePage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(activePage * ITEMS_PER_PAGE, filteredAttractions.length)} of {filteredAttractions.length} entries
          </Text>
          <Pagination 
            total={Math.max(1, Math.ceil(filteredAttractions.length / ITEMS_PER_PAGE))} 
            value={activePage} 
            onChange={setPage} 
            color="green.9" 
            radius="md" 
          />
        </Group>
      </Paper>

      {/* View Drawer */}
      <Drawer 
        opened={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        title={<Title order={4}>{selectedAttraction?.name}</Title>}
        position="right"
        size="md"
        padding="lg"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedAttraction && (
          <Stack gap="md">
            {selectedAttraction.imageUrls && selectedAttraction.imageUrls.length > 0 ? (
              <Image 
                src={`http://localhost:8080${selectedAttraction.imageUrls[0]}`} 
                height={250} 
                radius="md" 
                fit="cover" 
              />
            ) : (
              <Image src="https://placehold.co/600x250?text=No+Image" height={250} radius="md" />
            )}

            <Group>
              <Badge color="green.9">{selectedAttraction.category}</Badge>
              <Badge color="blue.9" variant="light">{selectedAttraction.distance}</Badge>
            </Group>

            <div>
              <Text fw={600} size="sm" c="dimmed" tt="uppercase" mb={4}>Description</Text>
              <Text size="sm">{selectedAttraction.description}</Text>
            </div>

            <Divider />

            <Grid>
              <Grid.Col span={6}>
                <Text fw={600} size="sm" c="dimmed" tt="uppercase" mb={4}>Opening Time</Text>
                <Text size="sm">{selectedAttraction.openingTime || 'N/A'}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={600} size="sm" c="dimmed" tt="uppercase" mb={4}>Coordinates</Text>
                <Text size="sm">{selectedAttraction.latitude}, {selectedAttraction.longitude}</Text>
              </Grid.Col>
            </Grid>

            <div>
              <Text fw={600} size="sm" c="dimmed" tt="uppercase" mb={4}>Travel Tips</Text>
              <Text size="sm">{selectedAttraction.travelTips || 'None provided.'}</Text>
            </div>
          </Stack>
        )}
      </Drawer>

    </Container>
  );
}
