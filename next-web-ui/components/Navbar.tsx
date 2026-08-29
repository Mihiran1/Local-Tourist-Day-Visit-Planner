"use client";

import { Group, Button, Container, Text, Avatar, Menu, UnstyledButton, Image } from '@mantine/core';
import { IconChevronDown, IconHeart, IconLogout, IconSettings } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  
  // දැනට අපි බොරුවට (Mock) හිතමු User කෙනෙක් ලොග් වෙලා නෑ කියලා. 
  // (පස්සේ අපි මේක Backend එකෙන් එන ඇත්ත Data වලින් වෙනස් කරනවා)
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const userName = "Mihiran"; // ලොග් වුණු කෙනාගේ නම

  return (
    <div style={{ borderBottom: '1px solid #eaeaea', backgroundColor: '#ffffff' }}>
      <Container size="lg" h={70}>
        <Group justify="space-between" h="100%">
          
          <Group gap="xl">
            <Link href="/">
              <Image 
                src="/4.png" 
                alt="Travel LK Logo" 
                h={40} 
                fit="contain" 
                style={{ cursor: 'pointer' }}
              />
            </Link>

            <Group gap="lg" visibleFrom="sm" ml="xl">
              <Button component={Link} href="/" variant="subtle" color="dark">Home</Button>
              <Button component={Link} href="/attractions" variant="subtle" color="dark">All Places</Button>
              <Button component={Link} href="/map" variant="subtle" color="dark">Map View</Button>
              <Button component={Link} href="/about" variant="subtle" color="dark">About</Button>
            </Group>
          </Group>

          {/* දකුණු පැත්ත: Buttons හෝ Profile එක */}
          <Group>
            {!isLoggedIn ? (
              // ලොග් වෙලා නැති සාමාන්‍ය කෙනෙක්ට පේන විදිය
              <>
                <Button variant="default" onClick={() => router.push('/login')}>Log in</Button>
                <Button onClick={() => router.push('/signup')}>Sign up</Button>
              </>
            ) : (
              // ලොග් වුණු කෙනෙක්ට පේන Profile Menu එක
              <Menu shadow="md" width={200} position="bottom-end">
                <Menu.Target>
                  <UnstyledButton>
                    <Group gap={7}>
                      <Avatar radius="xl">{userName.charAt(0)}</Avatar>
                      <Text fw={500} size="sm" lh={1} mr={3}>{userName}</Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item leftSection={<IconHeart size={14} />} onClick={() => router.push('/favorites')}>
                    My Favorites
                  </Menu.Item>
                  <Menu.Item leftSection={<IconSettings size={14} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item 
                    color="red" 
                    leftSection={<IconLogout size={14} />}
                    onClick={() => setIsLoggedIn(false)}
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
