'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/',         label: '🏠 Inicio' },
  { href: '/grupos',   label: '📊 Grupos' },
  { href: '/bracket',  label: '🌳 Bracket' },
  { href: '/admin',    label: '⚙️ Admin', admin: true },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <span className="trophy">🏆</span>
          <span>Quiniela Mundial <span style={{ color: 'var(--green)' }}>2026</span></span>
        </Link>
        <div className="navbar-links">
          {links.map(({ href, label, admin }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${admin ? 'admin' : ''} ${pathname === href || (href !== '/' && pathname.startsWith(href)) ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
