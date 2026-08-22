"use client";

import { PasswordInput, Title, Text, Button, Box, Flex, PinInput, Center } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import api from '../../services/api';
import '../globals.css';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) router.replace('/forgot-password');
  }, [email, router]);

  const form = useForm({
    initialValues: { otpCode: '', newPassword: '' },
    validate: {
      otpCode: (value) => (value.length === 6 ? null : 'Enter 6-digit OTP'),
      newPassword: (value) =>
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,}$/.test(value)
          ? null
          : 'Password must be strong (8 chars, 1 uppercase, 1 special char)',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await api.post('/auth/reset-password', {
        email: email,
        otpCode: values.otpCode,
        newPassword: values.newPassword
      });
      // සාර්ථකව වෙනස් කළාම Login පිටුවට යවනවා
      router.push('/login');
    } catch (error: any) {
      form.setErrors({ otpCode: error.response?.data?.message || 'Failed to reset password' });
    }
  };

  return (
    <Flex h="100vh" w="100vw" className="login-container">
     <Box w={{ base: '0%', md: '50%', lg: '60%' }} className="login-image-side" visibleFrom="md" />
      <Box w={{ base: '100%', md: '50%', lg: '40%' }} className="login-form-side">
        <Box w="100%" maw={450}>
          <Title ta="center" fw={700} size="h2">Reset Password</Title>
          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt={5} mb={30}>
            Enter the OTP sent to <b>{email}</b>
          </Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Center mb="md">
              <PinInput length={6} size="lg" type="number" {...form.getInputProps('otpCode')} />
            </Center>
            
            <PasswordInput
              label={<Text fw={600} fz={{ base: 'sm', lg: 'md' }}>New Password</Text>}
              placeholder="Strong password"
              size="md"
              mb="xl"
              {...form.getInputProps('newPassword')}
            />

            <Button fullWidth size="md" type="submit" color="blue" radius="md">
              Reset Password
            </Button>
          </form>
        </Box>
      </Box>
    </Flex>
  );
}
