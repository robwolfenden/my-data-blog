'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './NavLink.module.css';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string; // optional, so you can keep existing layout classes
};

export default function NavLink({ href, children, className }: Props) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        classes.link,
        active ? classes.active : '',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}