"use client";

import {
  TextInput,
  PasswordInput,
  Anchor,
  Title,
  Text,
  Button,
  Box,
  Flex,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import '../globals.css';

export default function Signup() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
    },
    validate: {
      firstName: (value) => (value.length < 2 ? 'First name is too short' : null),
      lastName: (value) => (value.length < 2 ? 'Last name is too short' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone: (value) => (/^\+?[0-9. ()-]{7,15}$/.test(value) ? null : 'Invalid phone number'),
      password: (value) =>
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(value)
          ? null
          : 'Password must contain at least 8 chars (1 digit, 1 lowercase, 1 uppercase, 1 special char)',
    },
  });

  const handleSignup = async (values: typeof form.values) => {
    try {
      await api.post('/auth/signup', values);
      
      // සාර්ථකව ගිණුම හැදුවාම, OTP Verify කරන පිටුවට යවනවා
      router.push(`/verify-otp?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        form.setErrors({ email: error.response.data.message });
      } else {
        form.setErrors({ email: 'An error occurred during signup' });
      }
    }
  };

  return (
    <Flex h="100vh" w="100vw" className="login-container">
    {/* Image Side */}
      <Box 
        w={{ base: '0%', md: '50%', lg: '60%' }} 
        className="login-image-side"
        visibleFrom="md"
      />
      {/* Form Side */}
      <Box 
        w={{ base: '100%', md: '50%', lg: '40%' }} 
        className="login-form-side"
      >
        <Box w="100%" maw={450}>
          <Title ta="center" fw={700} size="h1">Create an account</Title>
          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt={5} mb={30}>
            Join Acme Inc today
          </Text>

          <form onSubmit={form.onSubmit(handleSignup)}>
            <Group grow mb="md">
              <TextInput
                label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>First Name</Text>}
                placeholder="John"
                size="md"
                {...form.getInputProps('firstName')}
              />
              <TextInput
                label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>Last Name</Text>}
                placeholder="Doe"
                size="md"
                {...form.getInputProps('lastName')}
              />
            </Group>

            <TextInput
              label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>Phone Number</Text>}
              placeholder="+94 77 123 4567"
              size="md"
              mb="md"
              {...form.getInputProps('phone')}
            />

            <TextInput
              label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>Email</Text>}
              placeholder="m@example.com"
              size="md"
              mb="md"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>Password</Text>}
              placeholder="Strong password"
              size="md"
              mb="xl"
              {...form.getInputProps('password')}
            />

            <Button fullWidth size="md" type="submit" color="green.9" radius="md">
              Sign Up
            </Button>
          </form>

          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt="xl">
            Already have an account?{' '}
            <Anchor component="button" fz={{ base: 'sm', lg: 'md' }} color="dimmed" className="underline-link" onClick={() => router.push('/login')}>
              Login
            </Anchor>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
