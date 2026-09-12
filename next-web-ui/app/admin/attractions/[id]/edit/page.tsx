"use client";

import { useState, useEffect } from 'react';
import { 
  Container, Paper, Title, Text, Button, Group, TextInput, Select, 
  Textarea, Grid, FileInput, Box, Flex, Stack, ThemeIcon, Breadcrumbs, Anchor, Loader, Center
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { 
  IconInfoCircle, IconMapPin, IconCamera, IconDeviceFloppy, 
  IconBuildingMonument, IconCategory, IconCompass, IconClock, 
  IconBulb, IconUpload 
} from '@tabler/icons-react';
import api from '../../../../../services/api';

const LocationPicker = dynamic(
  () => import('../../../../../components/LocationPicker'),
  { ssr: false, loading: () => <Text c="dimmed">Loading Map...</Text> }
);

const timeOptions = Array.from({ length: 24 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const displayHour = hour === 0 ? 12 : hour;
  const formattedHour = displayHour.toString().padStart(2, '0');
  return `${formattedHour}:${minute}`;
});

export default function EditAttractionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const form = useForm({
    initialValues: {
      name: '',
      category: '',
      description: '',
      distance: '',
      openTime: '',
      openAmPm: 'AM',
      closeTime: '',
      closeAmPm: 'PM',
      travelTips: '',
      latitude: '',
      longitude: '',
      images: [] as File[],
    },

    validate: {
      name: (value) => (!value.trim() ? 'Attraction name is required' : null),
      category: (value) => (!value ? 'Category is required' : null),
      description: (value) => (!value.trim() ? 'Description is required' : null),
      distance: (value) => (!value.trim() ? 'Location / Distance is required' : null),
      // Images are not required for edit, they might just edit text
    },
  });

  // Page එක Load වෙද්දී පරණ Data ගේන කෑල්ල
  useEffect(() => {
    if (!id) return;
    
    const fetchAttraction = async () => {
      try {
        const res = await api.get(`/attractions/${id}`);
        const data = res.data;
        
        // පරණ Opening Time එක කඩලා Drop Downs වලට දාන විදිය
        const timeStr = data.openingTime || '';
        let openTime = '';
        let openAmPm = 'AM';
        let closeTime = '';
        let closeAmPm = 'PM';
        
        if (timeStr.includes('-')) {
          const parts = timeStr.split('-');
          const start = parts[0].trim().split(' ');
          const end = parts[1].trim().split(' ');
          if (start.length === 2) { openTime = start[0]; openAmPm = start[1]; }
          if (end.length === 2) { closeTime = end[0]; closeAmPm = end[1]; }
        } else if (timeStr.includes(' ')) {
          const start = timeStr.trim().split(' ');
          if (start.length === 2) { openTime = start[0]; openAmPm = start[1]; }
        }
        
        // ගෙනාපු Data ටික Form එකට දානවා (Auto fill වෙනවා)
        form.setValues({
          name: data.name || '',
          category: data.category || '',
          description: data.description || '',
          distance: data.distance || '',
          latitude: data.latitude?.toString() || '',
          longitude: data.longitude?.toString() || '',
          travelTips: data.travelTips || '',
          openTime,
          openAmPm,
          closeTime,
          closeAmPm,
          images: [],
        });
        
      } catch (error) {
        console.error("Error fetching attraction:", error);
        alert('Failed to load attraction details.');
      } finally {
        setPageLoading(false);
      }
    };
    
    fetchAttraction();
  }, [id]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', values.name);
      data.append('category', values.category);
      data.append('description', values.description);
      data.append('distance', values.distance);
      
      let finalOpeningTime = '';
      if (values.openTime && values.closeTime) {
        finalOpeningTime = `${values.openTime} ${values.openAmPm} - ${values.closeTime} ${values.closeAmPm}`;
      } else if (values.openTime) {
        finalOpeningTime = `${values.openTime} ${values.openAmPm}`;
      }
      data.append('openingTime', finalOpeningTime);
      
      data.append('travelTips', values.travelTips);
      data.append('latitude', values.latitude);
      data.append('longitude', values.longitude);
      
      values.images.forEach((file) => {
        data.append('images', file);
      });

      // Update කරන නිසා api.put පාවිච්චි කරනවා
      await api.put(`/admin/attractions/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Attraction updated successfully!');
      router.push('/admin/attractions');
    } catch (error) {
      console.error(error);
      alert('Error updating attraction');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { title: 'Admin', href: '/admin' },
    { title: 'Attractions', href: '/admin/attractions' },
    { title: 'Edit', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm" c="dimmed">
      {item.title}
    </Anchor>
  ));

  if (pageLoading) {
    return (
      <Center h="50vh">
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Box bg="gray.0" pb="xl">
      <Container size={1200} py="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          
          <Group justify="space-between" mb="xl" align="flex-end">
            <div>
              <Breadcrumbs separator=">" mb="xs">{breadcrumbs}</Breadcrumbs>
              <Title order={2} fw={800} c="dark.8">Edit Attraction</Title>
            </div>
            <Button 
              size="md"
              color="darkGreen.8" 
              type="submit" 
              radius="md"
              leftSection={<IconDeviceFloppy size={18} />}
              loading={loading}
            >
              Update Attraction
            </Button>
          </Group>

          <Stack gap="lg">
            
            <Paper withBorder p="xl" radius="md" shadow="sm" bg="white">
              <Group mb="lg">
                <ThemeIcon variant="light" size="lg" radius="md">
                  <IconInfoCircle size={20} />
                </ThemeIcon>
                <Title order={4}>Basic Information</Title>
              </Group>
              
              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput 
                    label="Attraction Name" 
                    placeholder="E.g., Maduru Oya National Park" 
                    withAsterisk
                    size="md"
                    leftSection={<IconBuildingMonument size={18} style={{ opacity: 0.5 }} />}
                    {...form.getInputProps('name')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Select 
                    label="Category" 
                    placeholder="Select a category" 
                    data={['Nature & Wildlife', 'Religious & Sacred', 'Heritage Sites', 'Cultural', 'Adventure', 'Industrial/Education', 'Restaurant']} 
                    withAsterisk
                    size="md"
                    leftSection={<IconCategory size={18} style={{ opacity: 0.5 }} />}
                    {...form.getInputProps('category')}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Textarea 
                    label="Detailed Description" 
                    placeholder="Comprehensive description of the attraction..." 
                    minRows={4} 
                    withAsterisk
                    size="md"
                    {...form.getInputProps('description')}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="xl" radius="md" shadow="sm" bg="white">
              <Group mb="lg">
                <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                  <IconMapPin size={20} />
                </ThemeIcon>
                <Title order={4}>Location Details</Title>
              </Group>

              <Grid>
                <Grid.Col span={12}>
                  <TextInput 
                    label="City / Distance" 
                    placeholder="E.g., 20km from Polonnaruwa" 
                    withAsterisk
                    size="md"
                    leftSection={<IconMapPin size={18} style={{ opacity: 0.5 }} />}
                    {...form.getInputProps('distance')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput 
                    label="Latitude" 
                    placeholder="E.g., 7.9497" 
                    size="md"
                    leftSection={<IconCompass size={18} style={{ opacity: 0.5 }} />}
                    {...form.getInputProps('latitude')}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput 
                    label="Longitude" 
                    placeholder="E.g., 80.7891" 
                    size="md"
                    leftSection={<IconCompass size={18} style={{ opacity: 0.5 }} />}
                    {...form.getInputProps('longitude')}
                  />
                </Grid.Col>
                <Grid.Col span={12} mt="md">
                  <Text fw={500} size="sm" mb="xs">Pick Location on Map</Text>
                  <LocationPicker 
                    latitude={form.values.latitude ? Number(form.values.latitude) : null}
                    longitude={form.values.longitude ? Number(form.values.longitude) : null}
                    onChange={(lat, lng) => {
                      form.setFieldValue('latitude', lat.toFixed(6));
                      form.setFieldValue('longitude', lng.toFixed(6));
                    }}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="xl" radius="md" shadow="sm" bg="white">
              <Group mb="lg">
                <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                  <IconClock size={20} />
                </ThemeIcon>
                <Title order={4}>Visitor Information</Title>
              </Group>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text fw={500} size="sm" mb="xs">Opening Time</Text>
                  <Flex gap="xs">
                    <Select 
                      placeholder="Select Time" 
                      data={timeOptions}
                      searchable
                      size="md"
                      style={{ flex: 1 }}
                      leftSection={<IconClock size={18} style={{ opacity: 0.5 }} />}
                      {...form.getInputProps('openTime')}
                    />
                    <Select 
                      data={['AM', 'PM']}
                      size="md"
                      w={90}
                      {...form.getInputProps('openAmPm')}
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text fw={500} size="sm" mb="xs">Closing Time</Text>
                  <Flex gap="xs">
                    <Select 
                      placeholder="Select Time" 
                      data={timeOptions}
                      searchable
                      size="md"
                      style={{ flex: 1 }}
                      leftSection={<IconClock size={18} style={{ opacity: 0.5 }} />}
                      {...form.getInputProps('closeTime')}
                    />
                    <Select 
                      data={['AM', 'PM']}
                      size="md"
                      w={90}
                      {...form.getInputProps('closeAmPm')}
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={12} mt="md">
                  <Textarea 
                    label="Travel Tips & Safety" 
                    placeholder="E.g., Best time to visit is early morning. Wear comfortable shoes..." 
                    minRows={3}
                    size="md"
                    {...form.getInputProps('travelTips')}
                  />
                  <Text size="xs" c="dimmed" mt="xs" display="flex" style={{ alignItems: 'center', gap: '4px' }}>
                    <IconBulb size={14} /> Add useful tips to help tourists plan their visit better.
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            <Paper withBorder p="xl" radius="md" shadow="sm" bg="white">
              <Group mb="lg">
                <ThemeIcon variant="light" color="grape" size="lg" radius="md">
                  <IconCamera size={20} />
                </ThemeIcon>
                <Title order={4}>Media Gallery</Title>
              </Group>

              <FileInput 
                label="Update Images (Optional)" 
                description="Upload new images only if you want to replace the existing ones."
                placeholder="Click to browse or drag images here" 
                multiple 
                accept="image/*"
                size="md"
                leftSection={<IconUpload size={18} style={{ opacity: 0.5 }} />}
                {...form.getInputProps('images')}
              />
            </Paper>

          </Stack>
        </form>
      </Container>
    </Box>
  );
}
