"use client";

import { Container, Title, Text, Button, Group, Card, ActionIcon, Flex, Badge, TextInput, Paper, Timeline } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconTrash, IconDeviceFloppy } from '@tabler/icons-react';
import { useTripPlan } from '../../context/TripPlanContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import { useRouter } from 'next/navigation';

export default function PlanPage() {
  const { planItems, removeFromPlan, moveItemUp, moveItemDown, clearPlan } = useTripPlan();
  const { user } = useAuth();
  const router = useRouter();
  const [planName, setPlanName] = useState('My Awesome Day Trip');
  const [tripDate, setTripDate] = useState('');

  // Generate Timeline Times (Assuming 1.5 hours per place, starting at 09:00 AM)
  const generateTime = (index: number) => {
    const startHour = 9; 
    const totalMinutes = startHour * 60 + index * 90; // 90 mins per place
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

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

      await api.post('/api/plans', payload);
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
        <Title order={1} fw={900} mb="xl">Build Your Perfect Day Trip</Title>
        
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
              </Group>
            </Paper>

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
              <Title order={3} mb="xl">Your Timeline</Title>
              
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
    </div>
  );
}
