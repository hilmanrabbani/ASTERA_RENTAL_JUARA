'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Clock, Star, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import Reveal from '@/components/ui/Reveal';
import { createClient } from '@/lib/supabase/client';

const fadeUp = {
  hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

interface SiteContent {
  hero_title: string;
  hero_subtitle: string;
  promo_title: string;
  promo_text: string;
  cta_text: string;
  cta_link: string;
}

const DEFAULT_CONTENT: SiteContent = {
  hero_title: 'Selamat Datang di Astera Rental Bandung',
  hero_subtitle:
    'Solusi Perjalanan Nyaman & Elegan Anda. Pilih armada favorit, isi data, dan mobil siap diantar ke lokasi Anda.',
  promo_title: '✨ Konten ini bisa diubah dari Admin Portal!',
  promo_text:
    'Login sebagai admin → menu Konten Web → ubah judul & FAQ. Refresh halaman ini, otomatis berubah.',
  cta_text: 'Jelajahi Mobil',
  cta_link: '/katalog',
};

export default function HomePage() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('site_content')
        .select('key, value')
        .in('key', [
          'hero_title',
          'hero_subtitle',
          'promo_title',
          'promo_text',
          'cta_text',
          'cta_link',
        ]);

      if (data && data.length > 0) {
        const getVal = (key: string) =>
          (data.find((d) => d.key === key)?.value as { text?: string } | undefined)?.text;

        setContent({
          hero_title: getVal('hero_title') ?? DEFAULT_CONTENT.hero_title,
          hero_subtitle: getVal('hero_subtitle') ?? DEFAULT_CONTENT.hero_subtitle,
          promo_title: getVal('promo_title') ?? DEFAULT_CONTENT.promo_title,
          promo_text: getVal('promo_text') ?? DEFAULT_CONTENT.promo_text,
          cta_text: getVal('cta_text') ?? DEFAULT_CONTENT.cta_text,
          cta_link: getVal('cta_link') ?? DEFAULT_CONTENT.cta_link,
        });
      }
    })();
  }, []);

  const titleParts = content.hero_title.split('Astera Rental');

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
        {titleParts.length === 2 ? (
          <>
            {titleParts[0]}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-gold bg-clip-text text-transparent">
              Astera Rental
            </span>
            {titleParts[1]}
          </>
        ) : (
          content.hero_title
        )}
      </motion.h1>

      <motion.p
        variants={fadeUp}
        custom={2}
        initial="hidden"
        animate="show"
        className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
      >
        {content.hero_subtitle}
      </motion.p>

      <motion.div
        variants={fadeUp}
        custom={3}
        initial="hidden"
        animate="show"
        className="mt-9 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          href={content.cta_link}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full
                     bg-gradient-to-r from-brand-600 to-brand-500 px-7 py-3.5 text-sm font-bold text-white
                     shadow-xl transition hover:shadow-glow"
        >
          <span className="relative z-10">{content.cta_text}</span>
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
          <h2 className="text-lg font-bold">{content.promo_title}</h2>
          <p className="mt-2 text-sm text-muted">{content.promo_text}</p>
        </div>
      </Reveal>
    </section>
  );
}