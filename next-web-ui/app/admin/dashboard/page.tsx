"use client";

import { useEffect, useState } from 'react';
import { Title, Button, Table, Group, Text, Container, Image, ActionIcon, Flex, Badge } from '@mantine/core';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

interface Attraction {
  id: number;
  name: string;
  category: string;
  distance: string;
  imageUrl: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [attractions, setAttractions] = useState<Attraction[]>([]);

  useEffect(() => {
    // Admin කෙනෙක් නෙවෙයි නම් මේ Page එකට එන්න දෙන්නේ නෑ
    if (user && user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN') {
      router.push('/attractions');
      return;
    }

    // Database එකේ තියෙන Attractions ටික ගන්නවා
    const fetchAttractions = async () => {
      try {
        const response = await api.get('/attractions');
        setAttractions(response.data);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    };

    fetchAttractions();
  }, [user, router]);

  const rows = attractions.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        <Image
          src={element.imageUrl ? `http://localhost:8080${element.imageUrl}` : 'https://placehold.co/50'}
          w={50}
          h={50}
          radius="md"
          alt={element.name}
        />
      </Table.Td>
      <Table.Td>
        <Text fw={500}>{element.name}</Text>
      </Table.Td>
      <Table.Td>
        <Badge color="blue" variant="light">
          {element.category}
        </Badge>
      </Table.Td>
      <Table.Td>{element.distance}</Table.Td>
      <Table.Td>
        {/* පස්සේ අපිට මෙතනට Edit / Delete Buttons දාන්න පුළුවන් */}
        <Button variant="light" color="red" size="xs">Delete</Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container size="lg" py="xl">
      <Flex justify="space-between" align="center" mb="xl">
        <Title order={2}>Admin Dashboard - Attractions</Title>
        <Button onClick={() => router.push('/admin/attractions/new')}>
          + Add New Attraction
        </Button>
      </Flex>

      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Image</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Distance</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.length > 0 ? rows : (
            <Table.Tr>
              <Table.Td colSpan={5} ta="center">
                <Text c="dimmed">No attractions found. Add one!</Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Container>
  );
}
