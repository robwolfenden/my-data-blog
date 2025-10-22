'use client';
import Link from 'next/link';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <Link href="/" className="site-brand">Rob Wolfenden | Data & Analytics</Link>
        <nav className="site-nav" style={{ display: 'flex', gap: 20 }}>
          <Link href="/" className="site-nav__link">Home</Link>
          <Link href="/blog" className="site-nav__link">Blog</Link>
        </nav>
      </div>
    </header>
  );
}