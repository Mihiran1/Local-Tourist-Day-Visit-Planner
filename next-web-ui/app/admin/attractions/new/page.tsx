"use client";

import { useState } from 'react';
import { Title, Button, TextInput, Textarea, Container, Paper, FileInput, Flex, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import api from '../../../../services/api';

export default function AddAttraction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Mantine Form එකෙන් දත්ත ටික ලේසියෙන්ම අල්ලගන්නවා
  const form = useForm({
    initialValues: {
      name: '',
      category: '',
      description: '',
      distance: '',
      image: null as File | null,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      category: (value) => (value.trim().length > 0 ? null : 'Category is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      // පින්තූර (Files) යවන්න ඕනේ නිසා අපි FormData පාවිච්චි කරනවා (සාමාන්‍ය JSON බෑ)
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('description', values.description);
      formData.append('distance', values.distance);
      
      if (values.image) {
        formData.append('image', values.image);
      }

      // අපේ අලුත් API එකට Post Request එකක් යවනවා
      await api.post('/admin/attractions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // සාර්ථක වුණාම ආයෙත් Dashboard එකට යනවා
      router.push('/admin/dashboard');
    } catch (error) {
      console.error("Error adding attraction:", error);
      alert("Failed to add attraction. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Paper withBorder shadow="md" p="xl" radius="md">
        <Flex justify="space-between" align="center" mb="lg">
          <Title order={2}>Add New Attraction</Title>
          <Button variant="subtle" color="gray" onClick={() => router.push('/admin/dashboard')}>
            Back
          </Button>
        </Flex>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Attraction Name"
            placeholder="E.g. Maduru Oya National Park"
            required
            mb="md"
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Category"
            placeholder="E.g. Nature, Religious, Historical"
            required
            mb="md"
            {...form.getInputProps('category')}
          />

          <TextInput
            label="Distance from City Center"
            placeholder="E.g. 20 km"
            mb="md"
            {...form.getInputProps('distance')}
          />

          <Textarea
            label="Description"
            placeholder="Describe the place..."
            minRows={4}
            mb="md"
            {...form.getInputProps('description')}
          />

          {/* පින්තූරය Upload කරන තැන */}
          <FileInput
            label={<Text fw={500}>Upload Image</Text>}
            placeholder="Click to select an image"
            accept="image/png,image/jpeg,image/webp"
            mb="xl"
            clearable
            {...form.getInputProps('image')}
          />

          <Button fullWidth type="submit" loading={loading} color="blue">
            Save Attraction
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
