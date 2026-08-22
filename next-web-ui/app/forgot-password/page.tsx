"use client";

import { TextInput, Title, Text, Button, Box, Flex, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import '../globals.css';

export default function ForgotPassword() {
  const router = useRouter();

  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await api.post('/auth/forgot-password', values);
      // සාර්ථක වුණාම ඊළඟ පිටුවට (Reset Password) යවනවා
      router.push(`/reset-password?email=${encodeURIComponent(values.email)}`);
    } catch (error: any) {
      form.setErrors({ email: error.response?.data?.message || 'Failed to send OTP' });
    }
  };

  return (
    <Flex h="100vh" w="100vw" className="login-container">
     <Box w={{ base: '0%', md: '50%', lg: '60%' }} className="login-image-side" visibleFrom="md" />
      <Box w={{ base: '100%', md: '50%', lg: '40%' }} className="login-form-side">
        <Box w="100%" maw={450}>
          <Title ta="center" fw={700} size="h1">Forgot Password?</Title>
          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt={5} mb={30}>
            Enter your email to get an OTP
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>Email</Text>}
              placeholder="m@example.com"
              size="md"
              mb="xl"
              {...form.getInputProps('email')}
            />
            <Button fullWidth size="md" type="submit" color="blue" radius="md">
              Send OTP
            </Button>
          </form>

          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt="xl">
            Remember it? <Anchor component="button" fz={{ base: 'sm', lg: 'md' }} onClick={() => router.push('/login')}>Login</Anchor>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
