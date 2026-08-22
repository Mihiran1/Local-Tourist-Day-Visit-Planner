"use client";

import { Title, Text, Card, Group, ThemeIcon, SimpleGrid, Container } from '@mantine/core';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <Container fluid p="md">
      <Title order={2} mb="xs">
        Welcome back, {user?.email?.split('@')[0] || 'User'}!
      </Title>
      <Text c="dimmed" mb="xl">
        Here is your daily overview.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Total Users</Text>
            <ThemeIcon color="blue" variant="light" size="lg" radius="md">
              👥
            </ThemeIcon>
          </Group>
          <Title order={3}>1,204</Title>
          <Text size="sm" c="dimmed" mt="sm">
            +14% from last month
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Revenue</Text>
            <ThemeIcon color="green" variant="light" size="lg" radius="md">
              💰
            </ThemeIcon>
          </Group>
          <Title order={3}>$12,450</Title>
          <Text size="sm" c="dimmed" mt="sm">
            +5% from last month
          </Text>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Active Sessions</Text>
            <ThemeIcon color="grape" variant="light" size="lg" radius="md">
              🔥
            </ThemeIcon>
          </Group>
          <Title order={3}>342</Title>
          <Text size="sm" c="dimmed" mt="sm">
            Currently online
          </Text>
        </Card>
      </SimpleGrid>
    </Container>
  );
}
