"use client";

import { Container, Title, Text, Button, Group, Card, ActionIcon, Flex, Badge, TextInput, Paper, Timeline, Modal } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconTrash, IconDeviceFloppy } from '@tabler/icons-react';
import { useTripPlan } from '../../context/TripPlanContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { IconMap2 } from '@tabler/icons-react';

const MapComponent = dynamic(() => import('../../components/Map'), { ssr: false });

export default function PlanPage() {
  const { planItems, removeFromPlan, moveItemUp, moveItemDown, clearPlan } = useTripPlan();
  const { user } = useAuth();
  const router = useRouter();
  const [planName, setPlanName] = useState('My Awesome Day Trip');
  const [tripDate, setTripDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [clearModalOpen, setClearModalOpen] = useState(false);

  // Parse start time "HH:MM" into hours and minutes
  const getStartMinutes = () => {
    const [h, m] = startTime.split(':').map(Number);
    return (h || 9) * 60 + (m || 0);
  };

  // Generate Timeline Times (Assuming 1.5 hours per place)
  const generateTime = (index: number) => {
    const totalMinutes = getStartMinutes() + index * 90; // 90 mins per place
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    if (planItems.length === 0) return "0h 0m";
    const totalMins = planItems.length * 90;
    return `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
  };

  const mapMarkers = planItems.map((item, index) => ({
    id: item.id,
    name: `${index + 1}. ${item.name}`,
    lat: item.lat || 0,
    lng: item.lng || 0,
    image: item.imageUrl,
    category: item.category
  })).filter(m => m.lat !== 0 && m.lng !== 0);

  const routePositions = mapMarkers.map(m => [m.lat, m.lng] as [number, number]);

  const handleSavePlan = async () => {
    if (!user) {
      alert("Please login to save your plan!");
      router.push('/login');
      return;
    }
    if (planItems.length === 0) {
      alert("Add some attractions to your plan first!");
      return;
    }
    if (!tripDate) {
      alert("Please select a date for your trip!");
      return;
    }

    try {
      const payload = {
        name: planName,
        tripDate: tripDate,
        items: planItems.map((item, index) => ({
          attractionId: item.id,
          visitOrder: index + 1
        }))
      };

      await api.post('/plans', payload);
      alert("Visit plan saved successfully!");
      clearPlan();
      router.push('/');
    } catch (error) {
      console.error(error);
      alert("Failed to save the plan.");
    }
  };

  return (
    <div style={{ backgroundColor: '#fcfcfc', minHeight: '100vh', paddingBottom: '60px' }}>
      <Navbar />
      
      <Container size="lg" mt={40}>
        <Group justify="space-between" align="center" mb="xl">
          <Title order={1} fw={900}>Build Your Perfect Day Trip</Title>
          {planItems.length > 0 && (
            <Button 
              variant="light" 
              color="red" 
              onClick={() => setClearModalOpen(true)}
            >
              Start New Plan
            </Button>
          )}
        </Group>
        
        <Flex gap="xl" direction={{ base: 'column', md: 'row' }}>
          {/* Left Side: Selected Attractions */}
          <div style={{ flex: 2 }}>
            <Paper p="md" radius="md" withBorder mb="lg">
              <Group grow>
                <TextInput 
                  label="Plan Name" 
                  value={planName} 
                  onChange={(e) => setPlanName(e.currentTarget.value)} 
                />
                <TextInput 
                  type="date"
                  label="Trip Date" 
                  value={tripDate} 
                  onChange={(e) => setTripDate(e.currentTarget.value)} 
                />
                <TextInput 
                  type="time"
                  label="Start Time" 
                  value={startTime} 
                  onChange={(e) => setStartTime(e.currentTarget.value)} 
                />
              </Group>
            </Paper>

            {/* Map Preview */}
            {mapMarkers.length > 0 && (
              <Card p={0} radius="md" withBorder mb="lg" style={{ height: '350px', overflow: 'hidden' }}>
                <MapComponent 
                  interactive={true} 
                  markers={mapMarkers} 
                  routePositions={routePositions}
                  center={routePositions[0] || [7.6715, 81.0409]}
                  zoom={12}
                />
              </Card>
            )}

            {planItems.length === 0 ? (
              <Text c="dimmed">Your plan is empty. Go explore and add some places!</Text>
            ) : (
              planItems.map((item, index) => (
                <Card key={item.id} withBorder shadow="sm" radius="md" mb="sm" p="sm">
                  <Group justify="space-between" wrap="nowrap">
                    <Flex gap="md" align="center">
                      <Badge color="darkGreen.9" size="xl" circle>{index + 1}</Badge>
                      <div>
                        <Text fw={700} size="lg">{item.name}</Text>
                        <Text size="sm" c="dimmed">{item.category}</Text>
                      </div>
                    </Flex>
                    
                    <Group gap="xs">
                      <ActionIcon variant="light" color="gray" onClick={() => moveItemUp(index)}>
                        <IconArrowUp size={18} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="gray" onClick={() => moveItemDown(index)}>
                        <IconArrowDown size={18} />
                      </ActionIcon>
                      <ActionIcon variant="light" color="red" onClick={() => removeFromPlan(item.id)}>
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Card>
              ))
            )}
          </div>

          {/* Right Side: Timeline & Save Button */}
          <div style={{ flex: 1 }}>
            <Paper p="xl" radius="md" withBorder bg="darkGreen.9" c="white" style={{ position: 'sticky', top: '20px' }}>
              <Group justify="space-between" mb="xl">
                <Title order={3}>Your Timeline</Title>
                {planItems.length > 0 && (
                  <Badge color="teal.5" variant="light" size="lg">Total: {getTotalDuration()}</Badge>
                )}
              </Group>
              
              <Timeline active={planItems.length} bulletSize={14} lineWidth={2} color="teal.4">
                {planItems.map((item, index) => (
                  <Timeline.Item key={index} title={generateTime(index)}>
                    <Text size="sm" mt={4} opacity={0.9}>{item.name}</Text>
                  </Timeline.Item>
                ))}
                {planItems.length > 0 && (
                  <Timeline.Item title={generateTime(planItems.length)}>
                    <Text size="sm" mt={4} opacity={0.7}>Trip Ends</Text>
                  </Timeline.Item>
                )}
              </Timeline>

              <Button 
                fullWidth 
                color="teal.5" 
                mt="xl" 
                size="lg" 
                leftSection={<IconDeviceFloppy size={20} />}
                onClick={handleSavePlan}
                disabled={planItems.length === 0}
              >
                Save My Plan
              </Button>
            </Paper>
          </div>
        </Flex>
      </Container>
      
      {/* Clear Plan Confirmation Modal */}
      <Modal 
        opened={clearModalOpen} 
        onClose={() => setClearModalOpen(false)} 
        title={<Group gap="xs"><IconTrash color="red" size={24} /><Text fw={700} size="lg">Start New Plan</Text></Group>} 
        centered
        size="md"
        padding="xl"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <Text size="md" mb="xl">Are you sure you want to clear your current plan and start a new one? This action cannot be undone and you will lose your current selections.</Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setClearModalOpen(false)}>Cancel</Button>
          <Button color="red" onClick={() => {
            clearPlan();
            setClearModalOpen(false);
          }}>Yes, Clear Plan</Button>
        </Group>
      </Modal>
    </div>
  );
}
