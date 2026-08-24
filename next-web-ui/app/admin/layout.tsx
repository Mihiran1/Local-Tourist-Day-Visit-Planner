"use client";

import { AppShell, Burger, Group, Title, NavLink, Avatar, Menu, rem, Text, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { IconDashboard, IconMapPins, IconLogout, IconSettings } from '@tabler/icons-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const pathname = usePathname(); 
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <AppShell
      layout="alt" // මේකෙන් තමයි Sidebar එක Full Height කරන්නේ!
      header={{ height: 70 }} 
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }} 
      padding="md"
      bg="gray.0" 
    >
      {/* 1. Top Header එක (දැන් මේකේ තියෙන්නේ Burger එකයි User Menu එකයි විතරයි) */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xs">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Image 
              src="/4.png" 
              alt="Travel LK Logo" 
              w={120} 
              fit="contain" 
              hiddenFrom="sm" 
            />
          </Group>
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group gap="sm" style={{ cursor: 'pointer' }}>
                <Avatar color="green" radius="xl">{user?.email?.charAt(0).toUpperCase()}</Avatar>
                <Text fw={500} size="sm" visibleFrom="sm">{user?.email}</Text>
              </Group>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                Settings
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                color="red" 
                leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                onClick={handleLogout}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      {/* 2. Side Navbar එක (දැන් Travel LK Admin නම තියෙන්නේ මෙතන) */}
      <AppShell.Navbar p="md">
        <Group mb="xl" justify="space-between" align="center">
          <Image 
            src="/4.png" 
            alt="Travel LK Logo" 
            w={230} // ලෝගෝ එකේ සයිස් එක 200 දක්වා වැඩි කළා
            fit="contain" 
          />
          {/* Mobile එකේදී Sidebar එක ඇරියම ඒක වහන්න මෙතනත් Burger එකක් දාන්න ඕනේ */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>

        <NavLink
          label="Dashboard"
          leftSection={<IconDashboard size="1rem" stroke={1.5} />}
          active={pathname === '/admin/dashboard'}
          onClick={() => router.push('/admin/dashboard')}
          color="green.9"  
          variant="filled"
          mb="sm"
        />
        <NavLink
          label="Add Attraction"
          leftSection={<IconMapPins size="1rem" stroke={1.5} />}
          active={pathname === '/admin/attractions/new'}
          onClick={() => router.push('/admin/attractions/new')}
          color="green.9"  
          variant="filled"
        />
      </AppShell.Navbar>

      {/* 3. ප්‍රධාන Content එක */}
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
