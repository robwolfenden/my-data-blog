'use client';

import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  const [opened] = useDisclosure(false);

  return (
    <AppShell header={{ height: 64 }} footer={{ height: 64 }} padding="md">
      <AppShell.Header withBorder={false}>
        <SiteHeader />
      </AppShell.Header>

      <AppShell.Main className="page-main">
        {children}
      </AppShell.Main>

      <AppShell.Footer withBorder={false}>
        <SiteFooter />
      </AppShell.Footer>
    </AppShell>
  );
}