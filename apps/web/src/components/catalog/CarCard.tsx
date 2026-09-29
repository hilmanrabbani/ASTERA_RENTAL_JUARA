'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Users, Gauge, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Car } from '@/lib/dummyCars';
import { rupiah } from '@/lib/utils';

export default function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  const router = useRouter();

  // ---- Tilt effect pakai Framer Motion ----
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [9, -9]), {
    stiffness: 260,
    damping: 22,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 260,
    damping: 22,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const available = car.status === 'available';

  const pilih = () => {
    if (!available) return;
    // Nanti: setCar(car) + router.push('/checkout')
    router.push(`/checkout/${car.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.07, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="glow-card group relative flex h-full flex-col overflow-hidden rounded-3xl border
                   border-line bg-surface/70 backdrop-blur-xl transition-shadow duration-500
                   hover:shadow-card"
      >
        {/* Gambar */}
        <div className="relative h-52 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={car.image_url}
            alt={car.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur
              ${available ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}
          >
            {available ? 'Tersedia' : 'Sedang Disewa'}
          </span>

          {car.category && (
            <span className="absolute right-3 top-3 rounded-full border border-gold/50 bg-black/50 px-3 py-1 text-[11px] font-bold text-gold backdrop-blur">
              {car.category}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5" style={{ transform: 'translateZ(28px)' }}>
          <h3 className="text-lg font-extrabold leading-snug transition group-hover:text-brand-600 dark:group-hover:text-brand-400">
            {car.name}
          </h3>
          <p className="mt-1 text-xs text-muted">{car.brand}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
              <Gauge size={13} /> {car.transmission}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
              <Users size={13} /> {car.capacity} Kursi
            </span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-6">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">Harga / hari</p>
              <p className="text-xl font-extrabold text-gold">{rupiah(car.price_per_day)}</p>
            </div>

            <button
              onClick={pilih}
              disabled={!available}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition
                ${
                  available
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:shadow-glow'
                    : 'cursor-not-allowed bg-line text-muted'
                }`}
            >
              {available ? (
                <>
                  Pilih <ArrowRight size={14} />
                </>
              ) : (
                <>
                  <X size={14} /> Tidak Tersedia
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}