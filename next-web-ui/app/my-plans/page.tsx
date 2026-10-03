"use client";

import { Container, Title, Text, Card, Group, Badge, SimpleGrid, Paper, Flex, ThemeIcon, Timeline, Button } from '@mantine/core';
import { IconMap2, IconCalendarEvent, IconMapPin, IconClock, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTripPlan } from '../../context/TripPlanContext';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import Link from 'next/link';

interface VisitPlanItem {
  id: number;
  visitOrder: number;
  attraction: {
    id: number;
    name: string;
    category: string;
    distance: string;
  };
}

interface VisitPlan {
  id: number;
  name: string;
  tripDate: string;
  items: VisitPlanItem[];
}

export default function MyPlansPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState<VisitPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const { loadPlan } = useTripPlan();

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans/my-plans');
      setPlans(response.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchPlans();
  }, [user, router]);

  // Sort items by visitOrder for each plan
  const getSortedItems = (items: VisitPlanItem[]) => {
    return [...items].sort((a, b) => a.visitOrder - b.visitOrder);
  };

  const handleEdit = (plan: VisitPlan) => {
    const itemsToLoad = getSortedItems(plan.items).map(item => ({
      id: item.attraction.id,
      name: item.attraction.name,
      category: item.attraction.category,
      imageUrl: ''
    }));
    loadPlan(itemsToLoad);
    router.push(`/plan?editId=${plan.id}&name=${encodeURIComponent(plan.name)}&date=${plan.tripDate}`);
  };

  const handleDelete = async (planId: number) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      try {
        await api.delete(`/plans/${planId}`);
        fetchPlans(); // Refresh the list
      } catch (error) {
        console.error("Error deleting plan", error);
        alert("Failed to delete the plan.");
      }
    }
  };


  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />

      <Container size="lg" mt={40}>
        <Group justify="space-between" align="flex-end" mb="xl">
          <div>
            <Group gap="xs">
              <ThemeIcon color="teal.5" variant="light" size="lg" radius="xl">
                <IconMap2 size={18} />
              </ThemeIcon>
              <Title order={1} fw={900}>My Saved Plans</Title>
            </Group>
            <Text c="dimmed" mt={4} size="lg">View and manage your upcoming day trips</Text>
          </div>
        </Group>

        {loading ? (
          <Text>Loading your plans...</Text>
        ) : plans.length === 0 ? (
          <Paper p="xl" radius="md" withBorder ta="center" mt="xl">
            <ThemeIcon color="gray.2" c="gray.5" size={80} radius="100%" mb="md">
              <IconMap2 size={40} />
            </ThemeIcon>
            <Title order={3} c="gray.7">No plans yet</Title>
            <Text c="dimmed" mt="xs" mb="lg">You haven't saved any visit plans. Go to the homepage and start building your perfect day trip!</Text>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Badge size="lg" color="teal.5" style={{ cursor: 'pointer' }} p="md">Explore Attractions</Badge>
            </Link>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
            {plans.map((plan) => (
              <Card key={plan.id} withBorder shadow="sm" radius="md" p="xl" style={{ display: 'flex', flexDirection: 'column' }}>
                <Group justify="space-between" mb="md" align="flex-start">
                  <div>
                    <Title order={3} fw={700}>{plan.name}</Title>
                    <Group gap="xs" mt={4}>
                      <IconCalendarEvent size={16} color="var(--mantine-color-gray-5)" />
                      <Text size="sm" c="dimmed" fw={500}>{plan.tripDate}</Text>
                    </Group>
                  </div>
                  <Badge color="darkGreen.9" variant="light" size="lg">{plan.items.length} Places</Badge>
                </Group>

                <Paper bg="gray.0" p="md" radius="md" mt="md" style={{ flex: 1 }}>
                  <Text size="sm" fw={600} c="darkGreen.9" mb="md">Itinerary:</Text>
                  <Timeline active={plan.items.length} bulletSize={12} lineWidth={2} color="teal.4">
                    {getSortedItems(plan.items).map((item, idx) => (
                      <Timeline.Item key={item.id} title={item.attraction.name}>
                        <Group gap="xs" mt={4}>
                          <Badge size="xs" color="gray" variant="outline">{item.attraction.category}</Badge>
                        </Group>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Paper>

                <Group mt="md" grow>
                  <Button variant="light" color="teal" leftSection={<IconEdit size={16} />} onClick={() => handleEdit(plan)}>
                    Edit Plan
                  </Button>
                  <Button variant="light" color="red" leftSection={<IconTrash size={16} />} onClick={() => handleDelete(plan.id)}>
                    Delete
                  </Button>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </div>
  );
}
