'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Car, Instagram, Mail } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { WhatsappIcon } from '@/components/ui/Icons';
import { IG_LINK, MAIL_LINK, WA_LINK } from '@/lib/constants';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/katalog', label: 'Katalog Mobil' },
  { href: '/faq', label: 'FAQ' },
  { href: '/tentang', label: 'Tentang & Kontak' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl px-4 sm:px-6
          transition-all duration-500 ${
            scrolled
              ? 'border border-line bg-bg/80 py-2.5 shadow-card backdrop-blur-xl'
              : 'border border-transparent py-3'
          }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-lg transition group-hover:shadow-glow">
            <Car size={20} className="text-white" />
          </span>
          <span className="leading-tight">
            <span className="block font-extrabold tracking-tight">Astera</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              Rental Bandung
            </span>
          </span>
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition
                    ${
                      active
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-muted hover:text-content'
                    }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-brand-500/10 ring-1 ring-brand-500/25"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Aksi kanan */}
        <div className="flex items-center gap-2">
          <a
            href={IG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hidden h-10 w-10 place-items-center rounded-full border border-line bg-surface/70
                       text-muted transition hover:-translate-y-0.5 hover:border-gold hover:text-gold sm:grid"
          >
            <Instagram size={18} />
          </a>
          <a
            href={MAIL_LINK}
            aria-label="Email"
            className="hidden h-10 w-10 place-items-center rounded-full border border-line bg-surface/70
                       text-muted transition hover:-translate-y-0.5 hover:border-gold hover:text-gold sm:grid"
          >
            <Mail size={18} />
          </a>
          <ThemeToggle />

          <Link
            href="/katalog"
            className="hidden rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5
                       text-sm font-semibold text-white shadow-lg transition hover:shadow-glow sm:block"
          >
            Sewa Sekarang
          </Link>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/70 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl border border-line bg-bg/95 p-4 shadow-card backdrop-blur-xl lg:hidden"
          >
            <ul className="space-y-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-brand-500/10 hover:text-brand-600"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/katalog"
              className="mt-3 block rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Sewa Sekarang
            </Link>
            <div className="mt-3 flex justify-center gap-3">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-emerald-500 transition hover:border-gold"
              >
                <WhatsappIcon size={18} />
              </a>
              <a
                href={IG_LINK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition hover:border-gold hover:text-gold"
              >
                <Instagram size={18} />
              </a>
              <a
                href={MAIL_LINK}
                aria-label="Email"
                className="grid h-11 w-11 place-items-center rounded-full border border-line text-muted transition hover:border-gold hover:text-gold"
              >
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}