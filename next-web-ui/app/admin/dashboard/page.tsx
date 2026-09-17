"use client";

import { useEffect, useState } from 'react';
import {
  Title,
  Card,
  Button,
  Group,
  Text,
  Container,
  Badge,
  Paper,
  Stack,
  SimpleGrid,
  ThemeIcon,
  Box,
  Grid,
  Table,
  Avatar,
  ScrollArea,
  ColorSwatch
} from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import '@mantine/charts/styles.css';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import {
  IconMapPin,
  IconCheck,
  IconFileOff,
  IconUsers,
  IconCalendar,
  IconCalendarEvent,
  IconPlus,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react';
import classes from './dashboard.module.css';

// --- Brand palette -------------------------------------------------------
// Deep tea-estate green, not a generic SaaS green — with a single cinnamon
// gold accent reserved for the primary action so it stays meaningful.
const BRAND = {
  deep: '#0F3D2E',   // primary — deep tea green
  mid: '#1B5E3A',    // mid moss green
  leaf: '#52B788',   // fresh leaf green (accents, gradients)
  gold: '#D9A441',   // cinnamon gold — used sparingly, on the CTA only
  goldHover: '#C4923A',
  ink: '#0B2B1E',    // near-black green for headings
};

// API එකෙන් එන දත්ත වල හැඩය (Type එක) මෙතන කියනවා
interface DashboardStats {
  totalAttractions: number;
  totalUsers: number;
  totalVisitPlans: number;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Mock Data for Charts (Will be updated with real data)
export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  // ඇත්ත දත්ත තියාගන්න State එකක් හැදීම
  const [stats, setStats] = useState<DashboardStats>({
    totalAttractions: 0,
    totalUsers: 0,
    totalVisitPlans: 0,
  });

  const [categoryData, setCategoryData] = useState<{name: string, value: number, color: string}[]>([]);
  const [recentAttractions, setRecentAttractions] = useState<any[]>([]);

  // Page එක Load වෙද්දී API එකට කතා කිරීම
  useEffect(() => {
    // Admin කෙනෙක් නෙවෙයි නම් මේ Page එකට එන්න දෙන්නේ නෑ
    if (user && user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN') {
      router.push('/attractions');
      return;
    }

    const fetchStats = async () => {
      try {
        // අර අපි Backend එකේ හදපු අලුත් API එකට කතා කරනවා
        const response = await api.get('/admin/dashboard/stats');
        setStats(response.data); // ආපු දත්ත ටික State එකට දාගන්නවා

        // සියලුම Attractions අරගෙන Charts වලට ඕන දත්ත හදනවා
        const attrRes = await api.get('/attractions');
        const attractions = attrRes.data;

        // Category අනුව කීයක් තියෙනවද කියලා ගණන් කරනවා
        const categoryCount: Record<string, number> = {};
        attractions.forEach((a: any) => {
          const cat = a.category || 'Other';
          categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        });

        const colors = ['teal.6', 'blue.6', 'orange.6', 'grape.6', 'red.6', 'cyan.6', 'lime.6'];
        const catChartData = Object.keys(categoryCount).map((cat, index) => ({
          name: cat,
          value: categoryCount[cat],
          color: colors[index % colors.length]
        }));
        setCategoryData(catChartData.length > 0 ? catChartData : [{ name: 'No Data', value: 1, color: 'gray.4' }]);

        // Recently Added Attractions (Last 5 based on array order assuming newest are highest ID)
        const sorted = [...attractions].sort((a, b) => b.id - a.id);
        setRecentAttractions(sorted.slice(0, 5));

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [user, router]);

  // අර State එකේ තියෙන ඇත්ත දත්ත පාවිච්චි කරලා අර කාඩ් 5ට ඕන දත්ත හදාගන්නවා
  const statsData = [
    { title: "Total Attractions", value: stats.totalAttractions.toString(), diff: "+8%", icon: IconMapPin },
    { title: "Published", value: stats.totalAttractions.toString(), diff: "+12%", icon: IconCheck },
    { title: "Drafts & Pending", value: "0", diff: "0%", icon: IconFileOff },
    { title: "Registered Users", value: stats.totalUsers.toString(), diff: "+22%", icon: IconUsers },
    { title: "Visit Plans", value: stats.totalVisitPlans.toString(), diff: "+15%", icon: IconCalendar },
  ];

  return (
    <Container fluid py="md" px="xs">

      {/* 1. Welcome Banner — deep tea-green gradient with a hill-country silhouette */}
      <Paper
        radius="lg"
        p="xl"
        pos="relative"
        style={{
          overflow: 'hidden',
          background: `linear-gradient(135deg, ${BRAND.deep} 0%, ${BRAND.mid} 100%)`,
          boxShadow: '0 12px 32px -12px rgba(15, 61, 46, 0.45)',
        }}
      >
        {/* Signature decoration: layered hills, evoking tea-estate hill country.
            Purely decorative — kept subtle so it doesn't fight the content. */}
        <svg
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
          aria-hidden="true"
        >
          <path d="M0,300 L0,180 Q150,120 300,170 T600,150 T900,190 T1200,140 L1200,300 Z" fill="rgba(255,255,255,0.04)" />
          <path d="M0,300 L0,220 Q200,170 400,210 T800,200 T1200,210 L1200,300 Z" fill="rgba(255,255,255,0.07)" />
        </svg>

        <Group justify="space-between" align="center" pos="relative" style={{ zIndex: 1 }}>
          <Stack gap={4}>
            <Text size="sm" fw={600} c={BRAND.gold} tt="uppercase" style={{ letterSpacing: 1 }}>
              {getGreeting()}
            </Text>
            {/* මෙතන Admin ගේ ඇත්ත ඊමේල් එක පෙන්වනවා */}
            <Title order={2} c="white" fw={700}>
              {user?.email} 👋
            </Title>
            <Text size="sm" c="rgba(255,255,255,0.75)">
              Travel LK Admin Platform
            </Text>
          </Stack>

          <Group>
            <Badge
              variant="light"
              size="lg"
              radius="md"
              leftSection={<IconCalendarEvent size={16} />}
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'white' }}
            >
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Badge>
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => router.push('/admin/attractions/new')}
              className={classes.goldCta}
              style={{ backgroundColor: BRAND.gold, color: BRAND.ink, fontWeight: 600, border: 'none' }}
            >
              Add Attraction
            </Button>
          </Group>
        </Group>
      </Paper>

      {/* 2. Stats Grid — tonal green cards with a gentle lift on hover */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }} spacing="md" mt="xl">
        {statsData.map((stat, index) => {
          const isPositive = !stat.diff.includes('-') && stat.diff !== '0%';
          return (
            <Card
              key={stat.title}
              withBorder
              radius="md"
              padding={0}
              className={classes.statCard}
              style={{ overflow: 'hidden', animationDelay: `${index * 60}ms` }}
            >
              <Box style={{ height: 4, background: `linear-gradient(90deg, ${BRAND.mid}, ${BRAND.leaf})` }} />
              <Box p="md">
                <Group justify="space-between">
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    style={{ background: `linear-gradient(135deg, ${BRAND.mid}, ${BRAND.deep})`, color: 'white' }}
                  >
                    <stat.icon size={20} />
                  </ThemeIcon>
                  <Badge
                    size="sm"
                    variant="light"
                    color={stat.diff === '0%' ? 'gray' : isPositive ? 'teal' : 'red'}
                    leftSection={
                      stat.diff !== '0%'
                        ? isPositive
                          ? <IconTrendingUp size={12} />
                          : <IconTrendingDown size={12} />
                        : null
                    }
                  >
                    {stat.diff}
                  </Badge>
                </Group>
                <Title order={2} mt="md" c={BRAND.ink}>{stat.value}</Title>
                <Text size="sm" fw={500} mt={4}>{stat.title}</Text>
                <Text size="xs" c="dimmed">vs last month</Text>
              </Box>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* 3. Charts Section */}
      <Grid mt="xl">
        {/* Recently Added List */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper withBorder p="xl" radius="md" bg="white" h="100%">
            <Group justify="space-between" mb="lg">
              <Title order={4} c="dark.8">Recently Added Attractions</Title>
              <Button variant="subtle" color="darkGreen.9" size="sm" onClick={() => router.push('/admin/attractions')}>View All</Button>
            </Group>
            
            <ScrollArea h={290}>
              <Table verticalSpacing="sm">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Attraction</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Location</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {recentAttractions.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar 
                            src={item.imageUrls && item.imageUrls.length > 0 ? `http://localhost:8080${item.imageUrls[0]}` : null} 
                            radius="md" 
                            size={40} 
                          />
                          <div>
                            <Text fz="sm" fw={500}>{item.name}</Text>
                          </div>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Badge color="gray" variant="light">{item.category}</Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">{item.distance}</Text>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  {recentAttractions.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={3} ta="center">
                        <Text c="dimmed" size="sm" py="md">No attractions found.</Text>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </ScrollArea>
          </Paper>
        </Grid.Col>

        {/* Donut Chart - Categories */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper withBorder p="xl" radius="md" bg="white" h="100%">
            <Title order={4} c="dark.8" mb="sm">Attractions by Category</Title>
            <Text size="sm" c="dimmed" mb="xl">Breakdown of destinations</Text>
            
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 220, position: 'relative' }}>
              <DonutChart 
                data={categoryData} 
                size={200}
                thickness={26}
                paddingAngle={6}
                withLabels={false}
                withTooltip
                chartLabel={stats.totalAttractions.toString()}
                strokeWidth={0}
              />
            </Box>
            
            <Stack gap="sm" mt="xl">
              {categoryData.map((item, index) => (
                <Group key={index} justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    <ColorSwatch color={`var(--mantine-color-${item.color.replace('.', '-')})`} size={14} />
                    <Text size="sm" fw={500} c="dark.7">{item.name}</Text>
                  </Group>
                  <Text size="sm" fw={700} c="dark.9">{item.value}</Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

    </Container>
  );
}