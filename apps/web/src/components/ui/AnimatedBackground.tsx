'use client';

import { motion } from 'framer-motion';

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: (i * 37) % 100,
  top: (i * 53) % 100,
  size: 2 + (i % 3),
  dur: 8 + (i % 7),
  delay: (i % 5) * 0.8,
}));

export default function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      {/* Grid halus */}
      <div className="absolute inset-0 bg-grid animate-gridMove opacity-60 dark:opacity-40" />

      {/* Gradient mesh blobs */}
      <motion.div
        className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand-500/25 blur-[130px]"
        animate={{ x: [0, 90, 0], y: [0, 70, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-gold/15 blur-[130px]"
        animate={{ x: [0, -70, 0], y: [0, 110, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-brand-400/20 blur-[140px]"
        animate={{ x: [0, 60, 0], y: [0, -80, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Partikel melayang */}
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-gold/60 dark:bg-gold/70"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}