"use client";

import { AppShell, Burger, Group, Title, NavLink, Avatar, Menu, rem, Text, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { IconDashboard, IconMapPins, IconLogout, IconSettings, IconList } from '@tabler/icons-react';

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
      layout="alt" // Makes the sidebar span the full height of the page
      header={{ height: 70 }} 
      navbar={{ width: 280, breakpoint: 'sm', collapsed: { mobile: !opened } }} 
      padding="md"
      bg="gray.0" 
    >
      {/* 1. Top header bar — contains the burger menu toggle and user profile menu */}
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
                <Avatar radius="xl">{user?.email?.charAt(0).toUpperCase()}</Avatar>
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

      {/* 2. Side navbar — contains the logo and navigation links */}
      <AppShell.Navbar p="md">
        <Group mb="xl" justify="space-between" align="center">
          <Image 
            src="/4.png" 
            alt="Travel LK Logo" 
            w={230} // Logo display width
            fit="contain" 
          />
          {/* Burger button inside the sidebar to close it on mobile */}
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>

        <NavLink
          label="Dashboard"
          leftSection={<IconDashboard size="1rem" stroke={1.5} />}
          active={pathname === '/admin/dashboard'}
          onClick={() => router.push('/admin/dashboard')}
          color="darkGreen.9"  
          variant="filled"
          mb="sm"
        />
        <NavLink
          label="All Attractions"
          leftSection={<IconList size="1rem" stroke={1.5} />}
          active={pathname === '/admin/attractions'}
          onClick={() => router.push('/admin/attractions')}
          color="darkGreen.9"  
          variant="filled"
          mb="sm"
        />
        <NavLink
          label="Add Attraction"
          leftSection={<IconMapPins size="1rem" stroke={1.5} />}
          active={pathname === '/admin/attractions/new'}
          onClick={() => router.push('/admin/attractions/new')}
          color="darkGreen.9"  
          variant="filled"
        />
      </AppShell.Navbar>

      {/* 3. Main content area */}
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
