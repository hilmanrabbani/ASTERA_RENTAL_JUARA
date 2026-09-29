'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';
import { WA_LINK } from '@/lib/constants';

function Inner() {
  return (
    <section className="mx-auto grid min-h-[70vh] max-w-2xl place-items-center px-5 pb-24 text-center sm:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"
        >
          <CheckCircle2 size={42} />
        </motion.span>

        <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">
          Pesanan Berhasil Dikirim!
        </h1>
        <p className="mt-3 text-muted">
          Admin akan segera memverifikasi data Anda dan menghubungi via WhatsApp.
          Jika WhatsApp belum terbuka otomatis, klik tombol di bawah.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:shadow-glow"
          >
            <MessageCircle size={17} /> Hubungi Admin
          </a>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-bold transition hover:border-gold hover:text-gold"
          >
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
        </div>

        <div className="mt-12 rounded-3xl border border-line bg-surface/60 p-6 text-left backdrop-blur-xl">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold">
            Langkah Selanjutnya
          </h2>
          <ol className="mt-4 space-y-3 text-sm text-muted">
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-600 dark:text-brand-400">
                1
              </span>
              Admin memverifikasi data & identitas Anda (estimasi &lt; 15 menit).
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-600 dark:text-brand-400">
                2
              </span>
              Anda akan dihubungi via WhatsApp untuk konfirmasi ketersediaan unit.
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/15 text-xs font-bold text-brand-600 dark:text-brand-400">
                3
              </span>
              Lakukan pembayaran & mobil siap diantar sesuai jadwal.
            </li>
          </ol>
        </div>
      </motion.div>
    </section>
  );
}

export default function SuksesPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}