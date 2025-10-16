"use client";

import { Accordion, AccordionProps } from '@mantine/core';
import { useTealium } from '../context/TealiumContext';

// Define the shape of the items we expect
interface AccordionItem {
  value: string;
  label: string;
  content: string;
}

// Extend Mantine's AccordionProps
interface TrackedAccordionProps extends Omit<AccordionProps, 'children'> {
  items: AccordionItem[];
}

export default function TrackedAccordion({ items, ...props }: TrackedAccordionProps) {
  const { trackLink } = useTealium();

  const handleAccordionChange = (value: string | null) => {
    // The `value` is the `value` of the item that was opened.
    if (value) {
      const openedItem = items.find(item => item.value === value);
      trackLink({
        event_action: 'accordion interact',
        event_content: `Opened: ${openedItem?.label || value}`,
      });
    }
  };

  return (
    <Accordion onChange={handleAccordionChange} {...props}>
      {items.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control>{item.label}</Accordion.Control>
          <Accordion.Panel>{item.content}</Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}