// src/ui/Grid.tsx
import { SimpleGrid, SimpleGridProps } from '@mantine/core';

export function CardsGrid(props: SimpleGridProps) {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2 }}
      spacing="lg"
      {...props}
    />
  );
}

export default CardsGrid;