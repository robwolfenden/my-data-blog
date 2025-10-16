// Full and final code for: src/components/TrackedButton.tsx

"use client";

import { Button, ButtonProps } from '@mantine/core';
import { useTealium } from '../context/TealiumContext';
import { MouseEvent, ReactNode } from 'react';
import Link from 'next/link';

// We extend the standard Mantine ButtonProps to accept all normal button properties
interface TrackedButtonProps extends ButtonProps {
  children: ReactNode;
  href?: string;
  eventAction?: string;
  // This can now accept a click event from either an anchor or a button
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export default function TrackedButton({ children, href, eventAction, onClick, ...props }: TrackedButtonProps) {
  const { trackLink } = useTealium();

  // FIX: Make the event handler accept a more generic event type
  const handleTrackedClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // Fire the tracking event
    trackLink({
      event_action: eventAction || 'button click',
      event_content: typeof children === 'string' ? children : 'complex button content',
    });

    // If an original onClick function was passed, call it too.
    if (onClick) {
      onClick(event);
    }
  };
  
  // Render as a Next.js Link if href is provided
  if (href) {
    return (
        <Button 
            component={Link}
            href={href}
            // This line will no longer cause an error
            onClick={handleTrackedClick} 
            {...props}
        >
            {children}
        </Button>
    );
  }

  // Otherwise, render as a standard button
  return (
    <Button onClick={handleTrackedClick} {...props}>
      {children}
    </Button>
  );
}