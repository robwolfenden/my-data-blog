// src/ui/Button.tsx
'use client';

import { MouseEvent, ReactNode } from 'react';
import Link, { LinkProps } from 'next/link';
import { Button as MButton, ButtonProps as MantineButtonProps } from '@mantine/core';
import { useTealium } from '../context/TealiumContext';

// Shared extras for analytics
type Shared = {
  analyticsId?: string;
  payload?: Record<string, any>;
  children: ReactNode;
};

// Renders an <a> via Next Link
type AnchorButtonProps = Shared &
  Omit<MantineButtonProps, 'component' | 'onClick' | 'href'> & {
    href: LinkProps['href'];
    onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  };

// Renders a real <button>
type NativeButtonProps = Shared &
  Omit<MantineButtonProps, 'component' | 'onClick' | 'href'> & {
    href?: undefined;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  };

export type ButtonProps = AnchorButtonProps | NativeButtonProps;

export default function Button({
  href,
  analyticsId,
  payload,
  onClick,
  children,
  ...rest
}: ButtonProps) {
  const { trackLink } = useTealium();
  const label = analyticsId ?? (typeof children === 'string' ? children : 'button');

  if (href) {
    // LINK BUTTON (anchor rendered through Next Link)
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
      // Narrow the union to the anchor signature for this branch:
      (onClick as ((ev: MouseEvent<HTMLAnchorElement>) => void) | undefined)?.(e);
      trackLink({ event_action: 'click', event_content: label, ...payload });
    };

    return (
      <MButton
        component={Link as any}
        href={href as any}
        onClick={handle as any}
        {...(rest as any)}
      >
        {children}
      </MButton>
    );
  }

  // NATIVE BUTTON
  const handle = (e: MouseEvent<HTMLButtonElement>) => {
    // Narrow the union to the button signature for this branch:
    (onClick as ((ev: MouseEvent<HTMLButtonElement>) => void) | undefined)?.(e);
    trackLink({ event_action: 'click', event_content: label, ...payload });
  };

  return (
    <MButton onClick={handle as any} {...(rest as any)}>
      {children}
    </MButton>
  );
}