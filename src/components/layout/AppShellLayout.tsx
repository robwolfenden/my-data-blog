'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppShell, Burger, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './AppShellLayout.module.css';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Blog', href: '/blog' },
];

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const pathname = usePathname();

  return (
    <AppShell
  header={{ height: 64 }}
  // tablet = mobile menu; desktop from md+
  navbar={{ width: 300, breakpoint: 'md', collapsed: { desktop: true, mobile: !opened } }}
  padding="md"
>
  <AppShell.Header withBorder={false} style={{ paddingInline: 0 }}>
    <Group
      h="100%"
      px={0}
      className="container"
      justify="space-between"
      align="center"
    >
      <Burger
        opened={opened}
        onClick={toggle}
        hiddenFrom="md"        // ← was "sm"
        size="sm"
        aria-label="Toggle navigation"
      />

      <Link href="/" className="site-brand">Rob Wolfenden | Analytics & UX</Link>

      {/* Desktop nav only from md+ */}
      <Group gap="xs" visibleFrom="md" mr='xs' ml='xs'>   {/* ← was "sm"; also use ml="auto" */}
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
  </AppShell.Header>

  <AppShell.Navbar py="md" px="md">
    {links.map((l) => (
      <UnstyledButton
        key={l.href}
        component={Link}
        href={l.href}
        className={classes.control}
        onClick={close}
      >
        {l.label}
      </UnstyledButton>
    ))}
  </AppShell.Navbar>

  <AppShell.Main className="page-main">{children}</AppShell.Main>
</AppShell>
  );
}