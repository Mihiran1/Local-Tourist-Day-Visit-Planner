"use client";

import { useState } from 'react';
import { 
  Container, Paper, Title, Text, Button, Group, TextInput, Select, 
  Textarea, Grid, Box, Flex, Stack, ThemeIcon, Breadcrumbs, Anchor,
  FileButton, Card, SimpleGrid, Image, ActionIcon, Checkbox
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  IconInfoCircle, IconMapPin, IconCamera, IconDeviceFloppy, 
  IconBuildingMonument, IconCategory, IconCompass, IconClock, 
  IconBulb, IconUpload, IconPhoto, IconX
} from '@tabler/icons-react';
import api from '../../../../services/api';

const LocationPicker = dynamic(
  () => import('../../../../components/LocationPicker'),
  { ssr: false, loading: () => <Text c="dimmed">Loading Map...</Text> }
);

const timeOptions = Array.from({ length: 24 }).map((_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const displayHour = hour === 0 ? 12 : hour;
  const formattedHour = displayHour.toString().padStart(2, '0');
  return `${formattedHour}:${minute}`;
});

export default function AddAttractionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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
      is24Hours: false,
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
      images: (value) => (value.length === 0 ? 'At least one image is required' : null),
    },
  });

  const handleImagesChange = (files: File[]) => {
    const newFiles = [...form.values.images, ...files];
    form.setFieldValue('images', newFiles);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    const newFiles = form.values.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    form.setFieldValue('images', newFiles);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', values.name);
      data.append('category', values.category);
      data.append('description', values.description);
      data.append('distance', values.distance);
      
      let finalOpeningTime = '';
      if (values.is24Hours) {
        finalOpeningTime = '24 Hours Open';
      } else if (values.openTime && values.closeTime) {
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

      await api.post('/admin/attractions', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Attraction added successfully!');
      router.push('/admin/attractions');
    } catch (error) {
      console.error(error);
      alert('Error adding attraction');
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbs = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Attractions', href: '/admin/attractions' },
    { title: 'Add Attraction', href: '#' },
  ].map((item, index, array) => (
    <Anchor 
      component={Link}
      href={item.href} 
      key={index} 
      size="sm" 
      c={index === array.length - 1 ? "dark.8" : "blue"}
      fw={index === array.length - 1 ? 600 : 400}
      style={{ pointerEvents: index === array.length - 1 ? 'none' : 'auto', textDecoration: 'none' }}
    >
      {item.title}
    </Anchor>
  ));

  return (
    <Box bg="gray.0" pb="xl">
      <Container size={1200} py="xl">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          
          {/* Header Section */}
          <Group justify="space-between" mb="xl" align="flex-end">
            <div>
              <Breadcrumbs separator=">" mb="xs">{breadcrumbs}</Breadcrumbs>
              <Title order={2} fw={800} c="dark.8">Add New Attraction</Title>
            </div>
          </Group>

          {/* Form Sections Stack */}
          <Stack gap="lg">
            
            {/* Basic Information */}
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
                    minRows={6}
                    autosize
                    maxRows={15}
                    withAsterisk
                    size="md"
                    {...form.getInputProps('description')}
                  />
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Location Information */}
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

            {/* Visitor Information */}
            <Paper withBorder p="xl" radius="md" shadow="sm" bg="white">
              <Group mb="lg">
                <ThemeIcon variant="light" color="orange" size="lg" radius="md">
                  <IconClock size={20} />
                </ThemeIcon>
                <Title order={4}>Visitor Information</Title>
              </Group>

              <Grid>
                <Grid.Col span={12} mb="xs">
                  <Checkbox
                    label="Open 24 Hours"
                    color="darkGreen.9"
                    size="md"
                    fw={500}
                    {...form.getInputProps('is24Hours', { type: 'checkbox' })}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text fw={500} size="sm" mb="xs" c={form.values.is24Hours ? "dimmed" : "dark"}>Opening Time</Text>
                  <Flex gap="xs">
                    <Select 
                      placeholder="Select Time" 
                      data={timeOptions}
                      searchable
                      size="md"
                      style={{ flex: 1 }}
                      leftSection={<IconClock size={18} style={{ opacity: 0.5 }} />}
                      disabled={form.values.is24Hours}
                      {...form.getInputProps('openTime')}
                    />
                    <Select 
                      data={['AM', 'PM']}
                      size="md"
                      w={90}
                      disabled={form.values.is24Hours}
                      {...form.getInputProps('openAmPm')}
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Text fw={500} size="sm" mb="xs" c={form.values.is24Hours ? "dimmed" : "dark"}>Closing Time</Text>
                  <Flex gap="xs">
                    <Select 
                      placeholder="Select Time" 
                      data={timeOptions}
                      searchable
                      size="md"
                      style={{ flex: 1 }}
                      leftSection={<IconClock size={18} style={{ opacity: 0.5 }} />}
                      disabled={form.values.is24Hours}
                      {...form.getInputProps('closeTime')}
                    />
                    <Select 
                      data={['AM', 'PM']}
                      size="md"
                      w={90}
                      disabled={form.values.is24Hours}
                      {...form.getInputProps('closeAmPm')}
                    />
                  </Flex>
                </Grid.Col>
                <Grid.Col span={12} mt="md">
                  <Textarea 
                    label="Travel Tips & Safety" 
                    placeholder="E.g., Best time to visit is early morning. Wear comfortable shoes..." 
                    minRows={5}
                    autosize
                    maxRows={10}
                    size="md"
                    {...form.getInputProps('travelTips')}
                  />
                  <Text size="xs" c="dimmed" mt="xs" display="flex" style={{ alignItems: 'center', gap: '4px' }}>
                    <IconBulb size={14} /> Add useful tips to help tourists plan their visit better.
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            {/* Media & Images */}
            <Paper withBorder p="xl" radius="md" shadow="sm" bg="white">
              <Group mb="lg">
                <ThemeIcon variant="light" color="grape" size="lg" radius="md">
                  <IconCamera size={20} />
                </ThemeIcon>
                <Title order={4}>Media Gallery</Title>
              </Group>

              <FileButton onChange={handleImagesChange} accept="image/*" multiple>
                {(props) => (
                  <Card 
                    {...props} 
                    withBorder 
                    style={{ 
                      borderStyle: 'dashed', 
                      borderWidth: 2,
                      borderColor: form.errors.images ? '#fa5252' : '#ced4da',
                      cursor: 'pointer', 
                      textAlign: 'center', 
                      backgroundColor: '#f8f9fa',
                      transition: 'background-color 0.2s ease'
                    }}
                    p="xl"
                  >
                    <Group justify="center">
                      <IconPhoto size={40} style={{ color: '#adb5bd' }} />
                    </Group>
                    <Text mt="md" fw={600} size="lg">Click to browse or upload images</Text>
                    <Text size="sm" c="dimmed">High-quality images attract more visitors. You can select multiple images.</Text>
                  </Card>
                )}
              </FileButton>
              
              {form.errors.images && (
                <Text c="red" size="sm" mt="xs">{form.errors.images}</Text>
              )}

              {imagePreviews.length > 0 && (
                <Box mt="lg">
                  <Text fw={500} size="sm" mb="xs">Selected Images ({imagePreviews.length})</Text>
                  <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Image 
                          src={preview} 
                          radius="md" 
                          h={120} 
                          w="100%" 
                          fit="cover" 
                          style={{ border: '1px solid #dee2e6' }}
                        />
                        <ActionIcon 
                          color="red" 
                          variant="filled" 
                          size="sm" 
                          radius="xl"
                          style={{ position: 'absolute', top: 5, right: 5, zIndex: 10 }}
                          onClick={() => removeImage(index)}
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </div>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </Paper>

            {/* Form Actions */}
            <Group justify="flex-end" mt="xl">
              <Button 
                variant="default"
                size="md"
                w={180}
                radius="md"
                onClick={() => {
                  form.reset();
                  setImagePreviews([]);
                }}
              >
                Reset Attraction
              </Button>
              <Button 
                size="md"
                w={180}
                color="darkGreen.8" 
                type="submit" 
                radius="md"
                leftSection={<IconDeviceFloppy size={18} />}
                loading={loading}
              >
                Save Attraction
              </Button>
            </Group>

          </Stack>
        </form>
      </Container>
    </Box>
  );
}