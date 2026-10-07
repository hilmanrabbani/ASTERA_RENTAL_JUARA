'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Loader2,
  ReceiptText,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowRight,
  Trash2,
  Calendar,
  Archive,
  RotateCcw,
  AlertTriangle,
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
  deleted_at: string | null;
  ktp_photo_url: string | null;
  selfie_photo_url: string | null;
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

const BULAN_NAMA = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

type ViewMode = 'active' | 'archive';

export default function AdminTransaksiPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | Order['status']>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [view, setView] = useState<ViewMode>('active');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [permanentDeleteId, setPermanentDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  // Pisahkan order aktif & arsip
  const activeOrders = useMemo(() => orders.filter((o) => !o.deleted_at), [orders]);
  const archivedOrders = useMemo(() => orders.filter((o) => o.deleted_at), [orders]);

  // Data yang ditampilkan sesuai tab
  const baseOrders = view === 'active' ? activeOrders : archivedOrders;

  // Daftar bulan yang tersedia dari data yang ada
  const availableMonths = useMemo(() => {
    const map = new Map<string, { key: string; label: string; count: number }>();
    baseOrders.forEach((o) => {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${BULAN_NAMA[d.getMonth()]} ${d.getFullYear()}`;
      if (!map.has(key)) map.set(key, { key, label, count: 0 });
      map.get(key)!.count += 1;
    });
    return Array.from(map.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [baseOrders]);

  const filtered = baseOrders.filter((o) => {
    const matchesQ =
      o.order_code.toLowerCase().includes(q.toLowerCase()) ||
      o.full_name.toLowerCase().includes(q.toLowerCase()) ||
      o.car_name.toLowerCase().includes(q.toLowerCase());

    const matchesFilter = filter === 'all' || o.status === filter;

    let matchesMonth = true;
    if (selectedMonth !== 'all') {
      const d = new Date(o.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      matchesMonth = key === selectedMonth;
    }

    return matchesQ && matchesFilter && matchesMonth;
  });

  const totalRevenue = filtered
    .filter((o) => o.status === 'approved' || o.status === 'done')
    .reduce((sum, o) => sum + o.total_price, 0);

  // ============ SOFT DELETE ============
  const handleSoftDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', deleteId);
      if (error) throw error;

      setDeleteId(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Gagal memindahkan pesanan ke arsip.');
    } finally {
      setDeleting(false);
    }
  };

  // ============ PULIHKAN DARI ARSIP ============
  const handleRestore = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('orders')
        .update({ deleted_at: null })
        .eq('id', id);
      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Gagal memulihkan pesanan.');
    }
  };

  // ============ HAPUS PERMANEN ============
  const handlePermanentDelete = async () => {
    if (!permanentDeleteId) return;
    setDeleting(true);

    try {
      const order = orders.find((o) => o.id === permanentDeleteId);
      if (!order) throw new Error('Order tidak ditemukan');

      const supabase = createClient();

      // Hapus file KTP & selfie dari Storage
      const filesToDelete: string[] = [];
      if (order.ktp_photo_url) filesToDelete.push(order.ktp_photo_url);
      if (order.selfie_photo_url) filesToDelete.push(order.selfie_photo_url);

      if (filesToDelete.length > 0) {
        const { error: storageErr } = await supabase.storage
          .from('ktp-documents')
          .remove(filesToDelete);
        if (storageErr) console.error('Gagal hapus file:', storageErr);
      }

      const { error: dbErr } = await supabase
        .from('orders')
        .delete()
        .eq('id', permanentDeleteId);
      if (dbErr) throw dbErr;

      setPermanentDeleteId(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus permanen.');
    } finally {
      setDeleting(false);
    }
  };

  const tabs: Array<{ key: typeof filter; label: string }> = [
    { key: 'all', label: `Semua (${baseOrders.length})` },
    { key: 'pending', label: `Pending (${baseOrders.filter((o) => o.status === 'pending').length})` },
    { key: 'approved', label: `Disetujui (${baseOrders.filter((o) => o.status === 'approved').length})` },
    { key: 'rejected', label: `Ditolak (${baseOrders.filter((o) => o.status === 'rejected').length})` },
    { key: 'done', label: `Selesai (${baseOrders.filter((o) => o.status === 'done').length})` },
  ];

  return (
    <div>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">Manajemen Transaksi</h1>
        <p className="mt-1 text-sm text-muted">
          Tinjau pesanan masuk, filter per bulan, dan kelola pesanan customer.
        </p>
      </div>

      {/* Tabs: Aktif / Arsip */}
      <div className="mt-6 flex gap-2 rounded-xl border border-line bg-surface/60 p-1 backdrop-blur-xl">
        <button
          onClick={() => {
            setView('active');
            setSelectedMonth('all');
            setFilter('all');
          }}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
            view === 'active'
              ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg'
              : 'text-muted hover:text-content'
          }`}
        >
          📋 Aktif ({activeOrders.length})
        </button>
        <button
          onClick={() => {
            setView('archive');
            setSelectedMonth('all');
            setFilter('all');
          }}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold transition ${
            view === 'archive'
              ? 'bg-gradient-to-r from-gold to-yellow-600 text-white shadow-lg'
              : 'text-muted hover:text-content'
          }`}
        >
          <Archive size={14} className="mr-1.5 inline" /> Arsip ({archivedOrders.length})
        </button>
      </div>

      {/* Info banner untuk view Arsip */}
      {view === 'archive' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-sm"
        >
          <div className="flex items-start gap-3">
            <Archive size={18} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-bold text-gold">Mode Arsip</p>
              <p className="mt-1 text-muted">
                Pesanan di sini sudah dinonaktifkan tapi masih tersimpan. Anda bisa{' '}
                <strong>pulihkan</strong> (↩️) atau <strong>hapus permanen</strong> (🗑️).
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filter Bulan */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedMonth('all')}
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
            selectedMonth === 'all'
              ? 'border-brand-500/50 bg-brand-500/10 text-brand-600 dark:text-brand-400'
              : 'border-line text-muted hover:border-brand-500/40 hover:text-brand-500'
          }`}
        >
          <Calendar size={13} /> Semua Bulan
        </button>
        {availableMonths.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelectedMonth(m.key)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition ${
              selectedMonth === m.key
                ? 'border-gold/50 bg-gold/10 text-gold'
                : 'border-line text-muted hover:border-gold/40 hover:text-gold'
            }`}
          >
            {m.label} ({m.count})
          </button>
        ))}
      </div>

      {/* Statistik */}
      {selectedMonth !== 'all' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={15} className="text-gold" />
              <span className="font-bold">
                {availableMonths.find((m) => m.key === selectedMonth)?.label}
              </span>
              <span className="text-muted">· {filtered.length} pesanan</span>
            </div>
            <div className="text-sm">
              <span className="text-muted">Pendapatan (approved + done): </span>
              <span className="font-extrabold text-gold">{rupiah(totalRevenue)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs Status */}
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
          <p className="mt-4 font-bold">
            {view === 'archive' ? 'Arsip kosong' : 'Belum ada pesanan'}
          </p>
          <p className="mt-1 text-sm text-muted">
            {view === 'archive'
              ? 'Pesanan yang dihapus akan muncul di sini.'
              : selectedMonth === 'all'
                ? 'Pesanan dari customer akan muncul di sini.'
                : 'Tidak ada pesanan di bulan ini.'}
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
                className={`glow-card rounded-2xl border p-4 backdrop-blur-xl ${
                  view === 'archive'
                    ? 'border-gold/30 bg-gold/5 opacity-90'
                    : 'border-line bg-surface/60'
                }`}
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
                      <span className="text-[10px] text-muted">
                        {new Date(o.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      {view === 'archive' && o.deleted_at && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">
                          <Archive size={10} /> Diarsip{' '}
                          {new Date(o.deleted_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      )}
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

                  {/* CTA — Berbeda antara Aktif & Arsip */}
                  <div className="flex items-center gap-2">
                    {view === 'active' ? (
                      <>
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
                        <button
                          onClick={() => setDeleteId(o.id)}
                          aria-label="Arsipkan pesanan"
                          title="Arsipkan"
                          className="grid h-8 w-8 place-items-center rounded-full border border-red-500/40 text-red-500 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRestore(o.id)}
                          title="Pulihkan"
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-500 transition hover:bg-emerald-500 hover:text-white"
                        >
                          <RotateCcw size={13} /> Pulihkan
                        </button>
                        <button
                          onClick={() => setPermanentDeleteId(o.id)}
                          title="Hapus permanen"
                          className="grid h-8 w-8 place-items-center rounded-full border border-red-500/40 text-red-500 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ============ MODAL KONFIRMASI ARSIP ============ */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteId(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-line bg-bg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-500/15 text-amber-500">
                  <Archive size={20} />
                </span>
                <div>
                  <p className="font-bold">Pindahkan ke Arsip?</p>
                  <p className="text-xs text-muted">
                    Pesanan tidak dihapus permanen. Bisa dipulihkan dari tab Arsip.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-line py-2.5 text-sm font-bold transition hover:bg-line/30 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSoftDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-bold text-white transition hover:shadow-glow disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Memproses…
                    </>
                  ) : (
                    <>
                      <Archive size={14} /> Arsipkan
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ MODAL HAPUS PERMANEN ============ */}
      <AnimatePresence>
        {permanentDeleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setPermanentDeleteId(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-3xl border-2 border-red-500/40 bg-bg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-500/15 text-red-500">
                  <AlertTriangle size={20} />
                </span>
                <div>
                  <p className="font-bold text-red-500">Hapus Permanen?</p>
                  <p className="text-xs text-muted">
                    Data & foto KTP akan dihapus selamanya. Tidak bisa dipulihkan.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setPermanentDeleteId(null)}
                  disabled={deleting}
                  className="flex-1 rounded-xl border border-line py-2.5 text-sm font-bold transition hover:bg-line/30 disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handlePermanentDelete}
                  disabled={deleting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 disabled:opacity-60"
                >
                  {deleting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Menghapus…
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} /> Hapus Permanen
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}