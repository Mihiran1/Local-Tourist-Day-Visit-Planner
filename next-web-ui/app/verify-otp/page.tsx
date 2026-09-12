"use client";

import { useEffect } from 'react';
import { Title, Text, Button, Box, Flex, PinInput, Center, Anchor } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../services/api'; // services folder was copied to root
import '../globals.css'; // Use globals if Login.css is not copied, or adjust this later

export default function VerifyOtp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || ''; // URL එකෙන් email එක ගන්නවා

  // ඊමේල් එකක් නැත්නම් ආපහු Signup එකට යවනවා
  useEffect(() => {
    if (!email) {
      router.replace('/signup'); // react-router-dom එකේ replace: true වෙනුවට Next.js වල මෙහෙමයි පාවිච්චි කරන්නේ
    }
  }, [email, router]);

  const form = useForm({
    initialValues: {
      otpCode: '',
    },
    validate: {
      otpCode: (value) => (value.length === 6 ? null : 'Please enter the 6-digit OTP code'),
    },
  });

  const handleVerify = async (values: typeof form.values) => {
    try {
      await api.post('/auth/verify-otp', {
        email: email,
        otpCode: values.otpCode,
      });
      // සාර්ථක වුණාම ආපහු Login එකට යවනවා
      router.push('/login'); // Next.js වල navigate වෙනුවට router.push පාවිච්චි කරනවා
    } catch (error: any) {
      if (error.response?.data?.message) {
        form.setErrors({ otpCode: error.response.data.message });
      } else {
        form.setErrors({ otpCode: 'Invalid OTP code' });
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
          <Title ta="center" fw={700} size="h1">Verify your email</Title>
          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt={5} mb={30}>
            We've sent a 6-digit code to <br /><b>{email}</b>
          </Text>

          <form onSubmit={form.onSubmit(handleVerify)}>
            <Center mb="xl">
              <PinInput 
                length={6} 
                size="lg" 
                type="number"
                {...form.getInputProps('otpCode')}
              />
            </Center>

            <Button fullWidth size="md" type="submit" color="blue" radius="md">
              Verify Account
            </Button>
          </form>

          <Text c="dimmed" fz={{ base: 'sm', lg: 'md' }} ta="center" mt="xl">
            Didn't receive the code?{' '}
            <Anchor 
              component="button" 
              fz={{ base: 'sm', lg: 'md' }} 
              color="dimmed" 
              className="underline-link" 
              onClick={async (e) => {
                e.preventDefault();
                try {
                  await api.post('/auth/forgot-password', { email });
                  alert('A new OTP has been sent to your email!');
                } catch (error) {
                  alert('Failed to resend OTP. Please try again later.');
                }
              }}
            >
              Resend OTP
            </Anchor>
          </Text>
        </Box>
      </Box>
    </Flex>
  );
}
