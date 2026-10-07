'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Car, Clock, CheckCircle2, TrendingUp, Loader2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { rupiah } from '@/lib/utils';

interface Stats {
  totalCars: number;
  availableCars: number;
  pendingOrders: number;
  approvedOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      const [cars, pending, approved, done] = await Promise.all([
        supabase.from('cars').select('id, status', { count: 'exact' }),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending')
          .is('deleted_at', null),
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'approved')
          .is('deleted_at', null),
        supabase
          .from('orders')
          .select('total_price')
          .eq('status', 'done')
          .is('deleted_at', null),
      ]);

      const carsData = cars.data ?? [];
      const totalRevenue = (done.data ?? []).reduce(
        (s, o: { total_price: number }) => s + Number(o.total_price || 0),
        0
      );

      setStats({
        totalCars: carsData.length,
        availableCars: carsData.filter((c) => c.status === 'available').length,
        pendingOrders: pending.count ?? 0,
        approvedOrders: approved.count ?? 0,
        totalRevenue,
      });
      setLoading(false);
    })();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3 text-muted">
          <Loader2 size={32} className="animate-spin text-gold" />
          <p className="text-sm">Memuat dashboard…</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Unit Mobil',
      value: stats.totalCars,
      sub: `${stats.availableCars} tersedia`,
      icon: Car,
      color: 'from-brand-600 to-brand-500',
    },
    {
      label: 'Pesanan Pending',
      value: stats.pendingOrders,
      sub: 'Perlu ditinjau',
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
    },
    {
      label: 'Pesanan Disetujui',
      value: stats.approvedOrders,
      sub: 'Siap diantar',
      icon: CheckCircle2,
      color: 'from-emerald-600 to-emerald-400',
    },
    {
      label: 'Total Pendapatan',
      value: rupiah(stats.totalRevenue),
      sub: 'Dari pesanan selesai',
      icon: TrendingUp,
      color: 'from-yellow-600 to-gold',
    },
  ];

  const quick = [
    {
      href: '/admin/mobil',
      title: 'Kelola Mobil',
      desc: 'Tambah, edit, atau hapus armada',
      icon: Car,
    },
    {
      href: '/admin/transaksi',
      title: 'Lihat Transaksi',
      desc: 'Tinjau pesanan masuk & verifikasi KTP',
      icon: Clock,
    },
    {
      href: '/admin/konten',
      title: 'Edit Konten Web',
      desc: 'Ubah teks hero & FAQ tanpa koding',
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-extrabold sm:text-3xl">Ringkasan Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Pantau performa bisnis rental Anda secara real-time.
        </p>
      </motion.div>

      {/* Statistik Cards */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="glow-card rounded-3xl border border-line bg-surface/60 p-5 backdrop-blur-xl"
          >
            <span
              className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-lg`}
            >
              <c.icon size={19} />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted">
              {c.label}
            </p>
            <p className="mt-1 text-2xl font-extrabold">{c.value}</p>
            <p className="mt-1 text-[11px] text-muted">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-12"
      >
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold">
          Aksi Cepat
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {quick.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="glow-card group flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur-xl transition hover:-translate-y-1"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <q.icon size={19} />
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-1 text-sm font-bold">
                  {q.title}
                  <ArrowRight
                    size={13}
                    className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
                  />
                </span>
                <span className="mt-1 block text-xs text-muted">{q.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mt-12 rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-transparent to-transparent p-6 backdrop-blur-xl"
      >
        <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-gold">
          💡 Tips Admin
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li>
            • Periksa <span className="font-bold">Pesanan Pending</span> setiap hari agar respons
            cepat.
          </li>
          <li>
            • Update <span className="font-bold">status mobil</span> ke &quot;Sedang Disewa&quot;
            setelah diserahkan ke customer.
          </li>
          <li>
            • Konten hero &amp; FAQ bisa diubah kapan saja lewat menu{' '}
            <span className="font-bold">Konten Web</span>.
          </li>
        </ul>
      </motion.div>
    </div>
  );
}