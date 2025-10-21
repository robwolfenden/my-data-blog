'use client';

import Link from 'next/link';
import { Container } from '@mantine/core';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Container className="site-header__inner" size={960}>
        <Link href="/" className="site-brand">
          My Portfolio
        </Link>
        <nav className="site-nav">
          {nav.map((n) => {
            const active = n.href === '/' ? pathname === '/' : pathname?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? 'page' : undefined}
                className={`site-nav__link${active ? ' is-active' : ''}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}