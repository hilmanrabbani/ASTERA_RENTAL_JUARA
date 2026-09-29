'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Clock, Star, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <motion.span
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="show"
        className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur"
      >
        <Sparkles size={13} /> Rental Mobil Premium Bandung
      </motion.span>

      <motion.h1
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="show"
        className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
      >
        Selamat Datang di{' '}
        <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-gold bg-clip-text text-transparent">
          Astera Rental
        </span>{' '}
        Bandung
      </motion.h1>

      <motion.p
        variants={fadeUp}
        custom={2}
        initial="hidden"
        animate="show"
        className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
      >
        Solusi Perjalanan Nyaman &amp; Elegan Anda. Pilih armada favorit, isi data, dan mobil siap
        diantar ke lokasi Anda.
      </motion.p>

      <motion.div
        variants={fadeUp}
        custom={3}
        initial="hidden"
        animate="show"
        className="mt-9 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href="/katalog"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full
                     bg-gradient-to-r from-brand-600 to-brand-500 px-7 py-3.5 text-sm font-bold text-white
                     shadow-xl transition hover:shadow-glow"
        >
          <span className="relative z-10">Jelajahi Mobil</span>
          <ArrowRight
            size={17}
            className="relative z-10 transition-transform group-hover:translate-x-1"
          />
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </Link>

        <Link
          href="/katalog"
          className="rounded-full border border-line bg-surface/60 px-7 py-3.5 text-sm font-bold backdrop-blur transition hover:border-gold hover:text-gold"
        >
          Sewa Sekarang
        </Link>
      </motion.div>

      <motion.ul
        variants={fadeUp}
        custom={4}
        initial="hidden"
        animate="show"
        className="mt-14 grid w-full max-w-2xl gap-3 sm:grid-cols-3"
      >
        {[
          { icon: ShieldCheck, t: 'Asuransi Lengkap', s: 'Perjalanan aman' },
          { icon: Clock, t: 'Layanan 24 Jam', s: 'Respon cepat' },
          { icon: Star, t: '4.9 / 5.0', s: '500+ pelanggan' },
        ].map((b) => (
          <li
            key={b.t}
            className="glow-card flex items-center gap-3 rounded-2xl border border-line bg-surface/50 p-3.5 backdrop-blur"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <b.icon size={18} />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-sm font-bold">{b.t}</span>
              <span className="block text-xs text-muted">{b.s}</span>
            </span>
          </li>
        ))}
      </motion.ul>

      <Reveal delay={0.2} className="mt-20 w-full">
        <div className="glow-card rounded-3xl border border-line bg-surface/60 p-8 backdrop-blur-xl">
          <h2 className="text-lg font-bold">
            ✨ Navbar, Footer, dan Floating Social sudah aktif!
          </h2>
          <p className="mt-2 text-sm text-muted">
            Lihat pojok kanan atas (toggle tema) &amp; pojok kanan bawah (WhatsApp, Instagram, Email).
            Coba hover untuk melihat efek glow emas.
          </p>
        </div>
      </Reveal>
    </section>
  );
}