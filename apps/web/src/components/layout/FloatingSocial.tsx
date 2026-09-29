'use client';

import { motion } from 'framer-motion';
import { Instagram, Mail, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WhatsappIcon } from '@/components/ui/Icons';
import { IG_LINK, MAIL_LINK, WA_LINK } from '@/lib/constants';

export default function FloatingSocial() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const items = [
    {
      href: WA_LINK,
      label: 'WhatsApp',
      Icon: WhatsappIcon,
      cls: 'bg-emerald-500 text-white hover:shadow-[0_0_24px_-4px_rgba(16,185,129,.9)]',
    },
    {
      href: IG_LINK,
      label: 'Instagram',
      Icon: Instagram,
      cls: 'bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 text-white hover:shadow-[0_0_24px_-4px_rgba(236,72,153,.9)]',
    },
    {
      href: MAIL_LINK,
      label: 'Email',
      Icon: Mail,
      cls: 'bg-red-500 text-white hover:shadow-[0_0_24px_-4px_rgba(239,68,68,.9)]',
    },
  ];

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-8 sm:right-6">
      {items.map((it, i) => (
        <motion.a
          key={it.label}
          href={it.href}
          target={it.href.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          aria-label={it.label}
          initial={{ opacity: 0, scale: 0.4, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.12, type: 'spring', stiffness: 320, damping: 20 }}
          whileHover={{ scale: 1.12, y: -3 }}
          whileTap={{ scale: 0.94 }}
          className={`group relative grid h-12 w-12 place-items-center rounded-full shadow-lg transition ${it.cls}`}
        >
          <it.Icon size={20} />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-content px-3 py-1.5 text-xs font-semibold text-bg opacity-0 transition group-hover:opacity-100">
            {it.label}
          </span>
          {i === 0 && (
            <span className="absolute inset-0 -z-10 animate-pulseRing rounded-full bg-emerald-500/60" />
          )}
        </motion.a>
      ))}

      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Ke atas"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-bg/90 text-muted backdrop-blur transition hover:border-gold hover:text-gold"
        >
          <ArrowUp size={16} />
        </motion.button>
      )}
    </div>
  );
}
