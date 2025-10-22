// src/ui/Section.tsx
import { PropsWithChildren } from 'react';
import { Container, Title, Text, Stack } from '@mantine/core';

type Props = {
  title: string;
  description?: string;
  spacing?: number | string;
};

export function Section({ title, description, spacing = 'xl', children }: PropsWithChildren<Props>) {
  return (
    <Container fluid px={0} py={spacing} className="container">
      <Stack gap="sm">
        <Title order={2}>{title}</Title>
        {description && <Text c="dimmed">{description}</Text>}
      </Stack>
      <div style={{ marginTop: 24 }}>{children}</div>
    </Container>
  );
}

export default Section;