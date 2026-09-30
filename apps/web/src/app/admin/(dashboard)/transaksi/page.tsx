'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Search,
  Loader2,
  ReceiptText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { rupiah } from '@/lib/utils';

interface Order {
  id: string;
  order_code: string;
  car_name: string;
  car_image: string | null;
  full_name: string;
  whatsapp: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  service_type: string;
  total_price: number;
  status: 'pending' | 'approved' | 'rejected' | 'done';
  created_at: string;
}

const STATUS_META: Record<
  Order['status'],
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: 'Pending',
    color: 'bg-amber-500/15 text-amber-500 border-amber-500/40',
    icon: Clock,
  },
  approved: {
    label: 'Disetujui',
    color: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/40',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Ditolak',
    color: 'bg-red-500/15 text-red-500 border-red-500/40',
    icon: XCircle,
  },
  done: {
    label: 'Selesai',
    color: 'bg-brand-500/15 text-brand-500 border-brand-500/40',
    icon: CheckCircle2,
  },
};

export default function AdminTransaksiPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  const fetchOrders = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const matchesQ =
      o.order_code.toLowerCase().includes(q.toLowerCase()) ||
      o.full_name.toLowerCase().includes(q.toLowerCase()) ||
      o.car_name.toLowerCase().includes(q.toLowerCase());
    const matchesFilter = filter === 'all' || o.status === filter;
    return matchesQ && matchesFilter;
  });

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'all', label: `Semua (${orders.length})` },
    { key: 'pending', label: `Pending (${orders.filter((o) => o.status === 'pending').length})` },
    { key: 'approved', label: `Disetujui (${orders.filter((o) => o.status === 'approved').length})` },
    { key: 'rejected', label: `Ditolak (${orders.filter((o) => o.status === 'rejected').length})` },
    { key: 'done', label: `Selesai (${orders.filter((o) => o.status === 'done').length})` },
  ];

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Manajemen Transaksi</h1>
        <p className="mt-1 text-sm text-muted">
          Tinjau pesanan masuk, verifikasi identitas, dan ubah status pesanan.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
              filter === t.key
                ? 'border-gold/50 bg-gold/10 text-gold'
                : 'border-line text-muted hover:border-gold/40 hover:text-gold'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-4 py-3 backdrop-blur-xl">
        <Search size={16} className="shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari kode pesanan, nama, atau mobil…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted/60"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="mt-16 grid place-items-center py-20">
          <Loader2 size={32} className="animate-spin text-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-line py-20 text-center">
          <ReceiptText size={40} className="mx-auto text-muted/60" />
          <p className="mt-4 font-bold">Belum ada pesanan</p>
          <p className="mt-1 text-sm text-muted">
            Pesanan dari customer akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((o, i) => {
            const meta = STATUS_META[o.status];
            const Icon = meta.icon;
            return (
              <motion.div
                key={o.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="glow-card rounded-2xl border border-line bg-surface/60 p-4 backdrop-blur-xl"
              >
                <div className="flex flex-wrap items-center gap-4">
                  {/* Foto */}
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-line bg-line/20">
                    {o.car_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={o.car_image}
                        alt={o.car_name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-muted">
                        <ReceiptText size={20} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold tracking-wider text-gold">
                        {o.order_code}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${meta.color}`}
                      >
                        <Icon size={11} /> {meta.label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-bold">{o.car_name}</p>
                    <p className="text-xs text-muted">
                      {o.full_name} · {o.whatsapp}
                    </p>
                  </div>

                  {/* Tanggal & Harga */}
                  <div className="min-w-[140px]">
                    <p className="text-[11px] uppercase tracking-wider text-muted">Periode</p>
                    <p className="text-xs font-bold">
                      {o.start_date} → {o.end_date}
                    </p>
                    <p className="text-[11px] text-muted">
                      {o.duration_days} hari ·{' '}
                      {o.service_type === 'dengan_sopir' ? 'Dengan Sopir' : 'Lepas Kunci'}
                    </p>
                  </div>

                  <div className="min-w-[120px] text-right">
                    <p className="text-[11px] uppercase tracking-wider text-muted">Total</p>
                    <p className="text-sm font-extrabold text-gold">{rupiah(o.total_price)}</p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/admin/transaksi/${o.id}`}
                    className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:shadow-glow"
                  >
                    <Eye size={13} /> Detail
                    <ArrowRight
                      size={12}
                      className="transition group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
