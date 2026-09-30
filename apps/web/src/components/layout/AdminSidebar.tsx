'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Car,
  ReceiptText,
  FileText,
  LogOut,
  ExternalLink,
  X,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const MENU = [
  { href: '/admin', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/admin/mobil', label: 'Kelola Mobil', icon: Car },
  { href: '/admin/transaksi', label: 'Transaksi', icon: ReceiptText },
  { href: '/admin/konten', label: 'Konten Web', icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/admin/login');
    router.refresh();
  };

  const SidebarContent = (
    <>
      <div className="border-b border-line px-6 py-5">
        <p className="text-sm font-extrabold">Astera Admin</p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold">Control Panel</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {MENU.map((m) => {
          const active =
            m.href === '/admin' ? pathname === '/admin' : pathname.startsWith(m.href);
          return (
            <Link
              key={m.href}
              href={m.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
                ${
                  active
                    ? 'bg-gradient-to-r from-brand-600/15 to-transparent text-brand-600 ring-1 ring-brand-500/25 dark:text-brand-400'
                    : 'text-muted hover:bg-brand-500/10 hover:text-content'
                }`}
            >
              <m.icon size={17} /> {m.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-muted transition hover:text-gold"
        >
          <ExternalLink size={17} /> Lihat Website
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
        >
          <LogOut size={17} /> Keluar
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Menu admin"
        className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-xl border border-line
                   bg-surface/90 backdrop-blur-xl lg:hidden"
      >
        <Menu size={18} />
      </button>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-surface/70 backdrop-blur-xl lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-bg lg:hidden"
            >
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line"
              >
                <X size={16} />
              </button>
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}