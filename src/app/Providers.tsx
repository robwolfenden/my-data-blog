// src/app/Providers.tsx
'use client';

import { MantineProvider } from '@mantine/core';
import { TealiumProvider } from '@/tracking/tealium';
import { theme } from '@/theme/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TealiumProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </TealiumProvider>
  );
}