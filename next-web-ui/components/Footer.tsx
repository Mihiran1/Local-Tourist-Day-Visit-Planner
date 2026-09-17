import { Container, Group, Text, Title, Stack, Grid, Box, Button } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './Footer.module.css';

const data = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', link: '/' },
      { label: 'All Places', link: '/attractions' },
      { label: 'Map View', link: '/map' },
      { label: 'About Us', link: '/about' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { label: 'Create Visit Plan', link: '/plan' },
      { label: 'My Plans', link: '/my-plans' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', link: '/login' },
      { label: 'Register', link: '/signup' },
      { label: 'Admin Dashboard', link: '/admin/dashboard' },
    ],
  },
];

export default function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text
        key={index}
        className={classes.link}
        component={Link}
        href={link.link}
      >
        {link.label}
      </Text>
    ));

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer className={classes.footer}>
      <Container size="lg" className={classes.inner}>
        <Grid >
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="sm">
              <Group gap="sm" align="center">
                <Box bg="teal.5" p={8} style={{ borderRadius: '50%', display: 'flex', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                  <IconMapPin size={22} stroke={2} color="white" />
                </Box>
                <Title order={3} c="white" fw={800} style={{ letterSpacing: '0.5px' }}>Travel LK</Title>
              </Group>
              <Text size="sm" c="gray.3" lh={1.6} className={classes.description} mt="xs">
                Discover hidden local attractions and plan your perfect day trip across Dehiattakandiya with ease and comfort.
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <div className={classes.groups}>{groups}</div>
          </Grid.Col>
        </Grid>
      </Container>
      <Container size="lg" className={classes.afterFooter}>
        <Text c="gray.5" size="sm">
          © {new Date().getFullYear()} Travel LK. University Software Project.
        </Text>

        <Group gap="xl" className={classes.social}>
          <Group gap="lg">
            <Text component="a" href="#" size="sm" c="gray.4" className={classes.bottomLink}>Privacy Policy</Text>
            <Text component="a" href="#" size="sm" c="gray.4" className={classes.bottomLink}>Terms of Use</Text>
          </Group>
          <Group gap={8}>
            <Button size="xs" variant="filled" color="teal.6" radius="xl" p="xs" style={{ minWidth: 0, paddingLeft: 14, paddingRight: 14 }}>EN</Button>
            <Button size="xs" variant="subtle" color="gray.3" radius="xl" p="xs" style={{ minWidth: 0, paddingLeft: 14, paddingRight: 14 }} className={classes.langBtn}>SI</Button>
            <Button size="xs" variant="subtle" color="gray.3" radius="xl" p="xs" style={{ minWidth: 0, paddingLeft: 14, paddingRight: 14 }} className={classes.langBtn}>TA</Button>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
