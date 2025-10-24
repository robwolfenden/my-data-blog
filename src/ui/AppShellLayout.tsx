'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppShell, Burger, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './AppShellLayout.module.css';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
  // add more here…
];

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
      padding="md"
    >
      {/* Header */}
      <AppShell.Header withBorder={false}>
        {/* keep your site-wide column */}
        <Group h="100%" px="sm" className="container">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            aria-label="Toggle navigation"
          />

          <Group justify="space-between" style={{ flex: 1 }}>
            {/* Brand / left side */}
            <Link href="/" className="site-brand">
              My Portfolio
            </Link>

            {/* Desktop nav */}
            <Group ml="xl" gap="xs" visibleFrom="sm">
              {links.map((l) => (
                <UnstyledButton
                  key={l.href}
                  component={Link}
                  href={l.href}
                  className={classes.control}
                  data-active={pathname === l.href || undefined}
                >
                  {l.label}
                </UnstyledButton>
              ))}
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Mobile-only navbar */}
      <AppShell.Navbar py="md" px="md">
        {links.map((l) => (
          <UnstyledButton
            key={l.href}
            component={Link}
            href={l.href}
            className={classes.control}
            onClick={close} // close menu after navigation
          >
            {l.label}
          </UnstyledButton>
        ))}
      </AppShell.Navbar>

      {/* Main content area keeps your global spacing */}
      <AppShell.Main className="page-main">{children}</AppShell.Main>
    </AppShell>
  );
}