"use client";

import { useState } from 'react';
import { Title, Button, TextInput, Textarea, Container, Paper, FileInput, Flex, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import api from '../../../../services/api';

export default function AddAttraction() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      category: '',
      description: '',
      distance: '',
      images: [] as File[], // File 1ක් වෙනුවට දැන් Array එකක් එනවා
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      category: (value) => (value.trim().length > 0 ? null : 'Category is required'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('category', values.category);
      formData.append('description', values.description);
      formData.append('distance', values.distance);
      
      // තෝරපු පින්තූර ඔක්කොම එකින් එක දානවා
      if (values.images && values.images.length > 0) {
        values.images.forEach((file) => {
          formData.append('images', file); // මෙතන key එක 'images' කියලාම යන්න ඕනේ
        });
      }

      await api.post('/admin/attractions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

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

          {/* multiple=true දාලා තියෙන නිසා පින්තූර ගොඩක් තෝරන්න පුළුවන් */}
          <FileInput
            label={<Text fw={500}>Upload Images</Text>}
            placeholder="Click to select multiple images"
            accept="image/png,image/jpeg,image/webp"
            mb="xl"
            clearable
            multiple
            {...form.getInputProps('images')}
          />

          <Button fullWidth type="submit" loading={loading} color="blue">
            Save Attraction
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
