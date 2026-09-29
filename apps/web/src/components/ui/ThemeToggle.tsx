'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = resolvedTheme === 'dark';

  // ✅ FIX HYDRATION: sebelum mounted, tampilkan placeholder (sama di server & client)
  if (!mounted) {
    return (
      <div
        aria-hidden
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/70 backdrop-blur"
      >
        <span className="block h-[18px] w-[18px]" />
      </div>
    );
  }

  return (
    <button
      aria-label="Ganti tema"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      className="relative grid h-10 w-10 place-items-center rounded-full border border-line
                 bg-surface/70 backdrop-blur transition hover:border-gold hover:shadow-glow"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25 }}
        >
          {dark ? (
            <Moon size={18} className="text-gold" />
          ) : (
            <Sun size={18} className="text-brand-600" />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}