"use client";

import { Group, Button, Container, Text, Avatar, Menu, UnstyledButton, Image } from '@mantine/core';
import { IconChevronDown, IconHeart, IconLogout, IconSettings, IconMap2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div style={{ borderBottom: '1px solid #eaeaea', backgroundColor: '#ffffff' }}>
      <Container fluid px={{ base: 'xs', sm: 'md', lg: 150 }} h={70}>
        <Group justify="space-between" h="100%" wrap="nowrap">
          
          {/* Left: Logo */}
          <Group>
            <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
              <Image 
                src="/4.png" 
                alt="Travel LK Logo" 
                h={{ base: 30, sm: 45 }} 
                w="auto"
                fit="contain" 
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </Link>
          </Group>

          {/* Center: Navigation Links */}
          <Group gap="md" visibleFrom="sm">
            <Button component={Link} href="/" variant="subtle" color="dark" radius="xl" fw={600}>Home</Button>
            <Button component={Link} href="/attractions" variant="subtle" color="dark" radius="xl" fw={600}>All Places</Button>
            <Button component={Link} href="/map" variant="subtle" color="dark" radius="xl" fw={600}>Map View</Button>
            <Button component={Link} href="/about" variant="subtle" color="dark" radius="xl" fw={600}>About</Button>
          </Group>

          {/* Right: Auth Buttons / Profile */}
          <Group wrap="nowrap">
            {!user ? (
              <>
                <Button variant="default" radius="xl" fw={600} onClick={() => router.push('/login')}>Log in</Button>
                <Button radius="xl" fw={600} color="darkGreen.9" onClick={() => router.push('/signup')}>Sign up</Button>
              </>

            ) : (
              // ලොග් වුණු කෙනෙක්ට පේන Profile Menu එක
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap={7}>
                      <Avatar radius="xl">{user.firstName?.charAt(0) || 'U'}</Avatar>
                      <Text fw={500} size="sm" lh={1} mr={3}>{user.firstName || 'User'}</Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item leftSection={<IconHeart size={14} />} onClick={() => router.push('/favorites')}>
                    My Favorites
                  </Menu.Item>
                  <Menu.Item leftSection={<IconMap2 size={14} />} onClick={() => router.push('/my-plans')}>
                    My Plans
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={14} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item 
                    color="red" 
                    leftSection={<IconLogout size={14} />}
                    onClick={logout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

        </Group>
      </Container>
    </div>
  );
}
