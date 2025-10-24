'use client';
import NavLink from '@/components/layout/NavLink';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner container">
        <NavLink href="/" className="site-brand">Rob Wolfenden | Data & Analytics</NavLink>
        <nav className="site-nav" style={{ display: 'flex', gap: 20 }}>
          <NavLink href="/" className="site-nav__link">Home</NavLink>
          <NavLink href="/blog" className="site-nav__link">Blog</NavLink>
        </nav>
      </div>
    </header>
  );
}