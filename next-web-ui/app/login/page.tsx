"use client";
import { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Anchor,
  Title,
  Text,
  Group,
  Button,
  Box,
  Flex,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import '../globals.css';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const handleLogin = async (values: typeof form.values) => {
    try {
      setUnverifiedEmail('');
      const response = await api.post('/auth/login', values);
      const { data } = response.data;
      
      // Backend එකෙන් එවන්නේ accessToken කියලයි
      login(data.accessToken, { email: data.email, role: data.role });
      
      // Role එක අනුව යවන Page එක තීරණය කරනවා
      if (data.role === 'ADMIN' || data.role === 'ROLE_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/attractions');
      }
      
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'An error occurred during login';
      form.setErrors({ email: errorMsg });
      
      // Check if it's the unverified error
      if (errorMsg.includes('not verified') || errorMsg.includes('verify your OTP')) {
        setUnverifiedEmail(values.email);
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
          <Title ta="center" fw={700} size="h1">Welcome back</Title>
          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt={5} mb={30}>
            Login to your Acme Inc account
          </Text>

          <form onSubmit={form.onSubmit(handleLogin)}>
            <TextInput
              label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>Email</Text>}
              placeholder="m@example.com"
              size="md"
              {...form.getInputProps('email')}
            />

            <Group justify="space-between" mt="md" mb={5}>
              <Text fw={600} fz={{ base: 'sm', lg: 'md' }} component="label" htmlFor="password-input">Password</Text>
              <Anchor component="button" fz={{ base: 'xs', lg: 'sm' }} color="dimmed" onClick={(e) => { e.preventDefault(); router.push('/forgot-password'); }}>
                Forgot your password?
              </Anchor>
            </Group>
            <PasswordInput
              id="password-input"
              placeholder="Your password"
              size="md"
              required
              {...form.getInputProps('password')}
            />

            <Button fullWidth mt="xl" size="md" type="submit" color="blue" radius="md">
              Login
            </Button>
          </form>

          {unverifiedEmail && (
            <Button 
              fullWidth 
              mt="md" 
              size="md" 
              color="red" 
              variant="light"
              radius="md"
              onClick={() => router.push(`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}`)}
            >
              Verify Account Now
            </Button>
          )}

          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt="xl">
            Don't have an account?{' '}
            <Anchor component="button" fz={{ base: 'sm', lg: 'md' }} color="dimmed" className="underline-link" onClick={() => router.push('/signup')}>
              Sign up
            </Anchor>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
