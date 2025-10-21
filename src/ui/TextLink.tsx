// src/ui/TextLink.tsx
'use client';

import React from 'react';
import Link, { LinkProps } from 'next/link';
import { Anchor, type AnchorProps } from '@mantine/core';
import { useTealium } from '../context/TealiumContext';

type Props = Omit<AnchorProps, 'href' | 'component' | 'onClick'> & {
  href: LinkProps['href'];
  analyticsId?: string;
  payload?: Record<string, any>;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export default function TextLink({
  href,
  analyticsId,
  payload,
  onClick,
  ...rest
}: Props) {
  const { trackLink } = useTealium();

  return (
    <Anchor
      component={Link}
      href={href}
      onClick={(e) => {
        // keep the caller's handler
        onClick?.(e);

        // fire analytics
        trackLink({
          event_action: 'click',
          event_content:
            analyticsId ?? (typeof href === 'string' ? href : 'link'),
          ...(payload ?? {}),
        });
      }}
      {...rest}
    />
  );
}