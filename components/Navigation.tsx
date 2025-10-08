'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/tutorias', label: 'Tutorías' },
  { href: '/cursos', label: 'Cursos' },
  { href: '/guias', label: 'Guías' }
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex justify-center bg-transparent">
      <nav className="mt-6 flex w-[min(960px,92vw)] items-center justify-between rounded-full border border-brand-accent/40 bg-[#F7F3ED] px-6 py-3 text-brand-base shadow-[0_8px_24px_rgba(0,0,0,0.22)]">
        <Link href="/" className="font-display text-lg italic tracking-tight">
          UNO Estudiante
        </Link>
        <div className="flex items-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'rounded-full px-4 py-2 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent',
                pathname === link.href
                  ? 'bg-brand-accent text-brand-base'
                  : 'bg-transparent text-brand-base hover:bg-brand-support/30'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
