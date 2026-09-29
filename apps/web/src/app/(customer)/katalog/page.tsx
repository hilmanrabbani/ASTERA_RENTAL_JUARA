'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import CarCard from '@/components/catalog/CarCard';
import { dummyCars } from '@/lib/dummyCars';
import { CATEGORIES } from '@/lib/constants';
import { rupiah } from '@/lib/utils';

export default function KatalogPage() {
  const [q, setQ] = useState('');
  const [kategori, setKategori] = useState<string>('Semua');
  const [maxHarga, setMaxHarga] = useState(2_500_000);
  const [sort, setSort] = useState<'termurah' | 'termahal' | 'nama'>('termurah');

  const hasil = useMemo(() => {
    let r = dummyCars.filter(
      (c) =>
        c.name.toLowerCase().includes(q.toLowerCase()) &&
        (kategori === 'Semua' || c.category === kategori) &&
        c.price_per_day <= maxHarga
    );

    if (sort === 'termurah') r = [...r].sort((a, b) => a.price_per_day - b.price_per_day);
    if (sort === 'termahal') r = [...r].sort((a, b) => b.price_per_day - a.price_per_day);
    if (sort === 'nama') r = [...r].sort((a, b) => a.name.localeCompare(b.name));

    return r;
  }, [q, kategori, maxHarga, sort]);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Katalog <span className="text-gold">Mobil</span>
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Pilih armada yang paling sesuai dengan kebutuhan perjalanan Anda di Bandung.
        </p>
      </motion.div>

      {/* Panel Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 rounded-3xl border border-line bg-surface/60 p-5 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-gold">
          <SlidersHorizontal size={15} /> Filter Pencarian
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
          {/* Pencarian */}
          <label className="flex items-center gap-2 rounded-xl border border-line bg-bg/70 px-4 py-3 transition focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/25">
            <Search size={16} className="shrink-0 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari nama mobil…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted/60"
            />
          </label>

          {/* Kategori */}
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm outline-none focus:border-gold"
          >
            <option value="Semua">Semua Kategori</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Harga Slider */}
          <div className="rounded-xl border border-line bg-bg/70 px-4 py-2.5">
            <div className="flex justify-between text-[11px] font-semibold text-muted">
              <span>Harga maksimal</span>
              <span className="text-gold">{rupiah(maxHarga)}</span>
            </div>
            <input
              type="range"
              min={100_000}
              max={2_500_000}
              step={50_000}
              value={maxHarga}
              onChange={(e) => setMaxHarga(+e.target.value)}
              className="mt-2 w-full accent-[rgb(var(--gold))]"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as never)}
            className="rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm outline-none focus:border-gold"
          >
            <option value="termurah">Termurah</option>
            <option value="termahal">Termahal</option>
            <option value="nama">Nama A-Z</option>
          </select>
        </div>
      </motion.div>

      {/* Grid Mobil */}
      {hasil.length === 0 ? (
        <div className="mt-16 rounded-3xl border border-dashed border-line py-20 text-center">
          <p className="text-lg font-bold">Belum ada mobil yang cocok</p>
          <p className="mt-1 text-sm text-muted">
            Coba ubah filter atau hubungi kami via WhatsApp.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((c, i) => (
            <CarCard key={c.id} car={c} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}