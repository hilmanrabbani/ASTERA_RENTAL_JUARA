'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Upload,
  Search,
  Car as CarIcon,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { rupiah } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

interface Car {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  image_url: string | null;
  transmission: string | null;
  capacity: number | null;
  price_per_day: number;
  status: 'available' | 'rented' | 'maintenance';
  description: string | null;
  is_featured: boolean;
  requires_driver?: boolean;
  biaya_sopir?: number;
}

const EMPTY: Omit<Car, 'id'> = {
  name: '',
  brand: '',
  category: 'MPV',
  image_url: '',
  transmission: 'Matic',
  capacity: 5,
  price_per_day: 350000,
  status: 'available',
  description: '',
  is_featured: false,
  requires_driver: false,
  biaya_sopir: 150000,
};

export default function AdminMobilPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Car, 'id'>>(EMPTY);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setCars((data as Car[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY);
    setFile(null);
    setError('');
    setModalOpen(true);
  };

  const openEdit = (car: Car) => {
    setEditId(car.id);
    setForm({
      name: car.name,
      brand: car.brand ?? '',
      category: car.category ?? 'MPV',
      image_url: car.image_url ?? '',
      transmission: car.transmission ?? 'Matic',
      capacity: car.capacity ?? 5,
      price_per_day: car.price_per_day,
      status: car.status,
      description: car.description ?? '',
      is_featured: car.is_featured,
      requires_driver: car.requires_driver ?? false,
      biaya_sopir: car.biaya_sopir ?? 150000,
    });
    setFile(null);
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const supabase = createClient();

    try {
      let imageUrl = form.image_url;

      if (file) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
        const { error: upErr } = await supabase.storage
          .from('car-images')
          .upload(fileName, file, { upsert: false, cacheControl: '3600' });

        if (upErr) throw new Error(`Gagal upload foto: ${upErr.message}`);

        const { data: publicData } = supabase.storage
          .from('car-images')
          .getPublicUrl(fileName);
        imageUrl = publicData.publicUrl;
      }

      const payload = { ...form, image_url: imageUrl };

      if (editId) {
        const { error: err } = await supabase
          .from('cars')
          .update(payload)
          .eq('id', editId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('cars').insert(payload);
        if (err) throw err;
      }

      setModalOpen(false);
      fetchCars();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    const { error } = await supabase.from('cars').delete().eq('id', deleteId);
    if (error) console.error(error);
    setDeleteId(null);
    fetchCars();
  };

  const filtered = cars.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      (c.brand ?? '').toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Kelola Mobil</h1>
          <p className="mt-1 text-sm text-muted">
            Tambah, edit, atau hapus armada rental Anda.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500
                     px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:shadow-glow"
        >
          <Plus size={17} /> Tambah Mobil
        </button>
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-4 py-3 backdrop-blur-xl">
        <Search size={16} className="shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama atau brand mobil…"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted/60"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="mt-16 grid place-items-center py-20">
          <Loader2 size={32} className="animate-spin text-gold" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-line py-20 text-center">
          <CarIcon size={40} className="mx-auto text-muted/60" />
          <p className="mt-4 font-bold">Belum ada mobil</p>
          <p className="mt-1 text-sm text-muted">
            Klik &quot;Tambah Mobil&quot; untuk menambahkan armada pertama Anda.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="glow-card overflow-hidden rounded-2xl border border-line bg-surface/60 backdrop-blur-xl"
            >
              <div className="relative h-40 overflow-hidden">
                {c.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.image_url}
                    alt={c.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-line/30">
                    <CarIcon size={32} className="text-muted" />
                  </div>
                )}
                <span
                  className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider
                    ${
                      c.status === 'available'
                        ? 'bg-emerald-500/90 text-white'
                        : c.status === 'rented'
                          ? 'bg-amber-500/90 text-white'
                          : 'bg-red-500/90 text-white'
                    }`}
                >
                  {c.status === 'available'
                    ? 'Tersedia'
                    : c.status === 'rented'
                      ? 'Disewa'
                      : 'Maintenance'}
                </span>
                {c.requires_driver && (
                  <span className="absolute right-2 top-2 rounded-full bg-gold/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black backdrop-blur">
                    🚗 Wajib Sopir
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="text-base font-bold">{c.name}</p>
                <p className="text-xs text-muted">{c.brand || '-'}</p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-gold">
                    {rupiah(c.price_per_day)}
                  </span>
                  <span className="text-[11px] text-muted">{c.transmission}</span>
                </div>

                {c.biaya_sopir && c.biaya_sopir > 0 && (
                  <p className="mt-1 text-[11px] text-muted">
                    Sopir: +{rupiah(c.biaya_sopir)}/hari
                  </p>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line py-2 text-xs font-bold transition hover:border-gold hover:text-gold"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(c.id)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/40 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500/10"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <div className="flex min-h-full items-start justify-center p-4 py-8">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg rounded-3xl border border-line bg-bg p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">
                    {editId ? 'Edit Mobil' : 'Tambah Mobil'}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="grid h-9 w-9 place-items-center rounded-full border border-line transition hover:border-red-500 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Label text="Nama Mobil">
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputCls}
                        placeholder="Toyota Avanza"
                      />
                    </Label>
                    <Label text="Brand">
                      <input
                        value={form.brand ?? ''}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className={inputCls}
                        placeholder="Toyota"
                      />
                    </Label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Label text="Kategori">
                      <select
                        value={form.category ?? 'MPV'}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className={inputCls}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </Label>
                    <Label text="Transmisi">
                      <select
                        value={form.transmission ?? 'Matic'}
                        onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                        className={inputCls}
                      >
                        <option value="Matic">Matic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </Label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Label text="Kapasitas">
                      <input
                        type="number"
                        value={form.capacity ?? 5}
                        onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
                        className={inputCls}
                      />
                    </Label>
                    <Label text="Harga / Hari">
                      <input
                        type="number"
                        required
                        value={form.price_per_day}
                        onChange={(e) => setForm({ ...form, price_per_day: +e.target.value })}
                        className={inputCls}
                      />
                    </Label>
                    <Label text="Status">
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value as Car['status'] })
                        }
                        className={inputCls}
                      >
                        <option value="available">Tersedia</option>
                        <option value="rented">Disewa</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </Label>
                  </div>

                  {/* Checkbox Wajib Sopir */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-line bg-bg/50 p-4 transition hover:border-gold/50">
                    <input
                      type="checkbox"
                      checked={form.requires_driver ?? false}
                      onChange={(e) =>
                        setForm({ ...form, requires_driver: e.target.checked })
                      }
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-[rgb(var(--gold))]"
                    />
                    <span>
                      <span className="block text-sm font-bold">
                        🚗 Tidak Bisa Lepas Kunci
                      </span>
                      <span className="mt-1 block text-xs text-muted">
                        Centang jika unit ini <strong>wajib dengan sopir</strong>. Customer
                        tidak akan bisa memilih opsi &quot;Lepas Kunci&quot; di halaman
                        pemesanan.
                      </span>
                    </span>
                  </label>

                  {/* Biaya Sopir per Hari */}
                  <Label text="Biaya Jasa Sopir (Rp / hari)">
                    <input
                      type="number"
                      min={0}
                      step={10000}
                      value={form.biaya_sopir ?? 150000}
                      onChange={(e) =>
                        setForm({ ...form, biaya_sopir: +e.target.value })
                      }
                      className={inputCls}
                      placeholder="150000"
                    />
                    <span className="mt-1 block text-[11px] text-muted">
                      Biaya tambahan jika customer memilih &quot;Dengan Sopir&quot;. Default:
                      Rp 150.000
                    </span>
                  </Label>

                  <Label text="Deskripsi">
                    <textarea
                      rows={2}
                      value={form.description ?? ''}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className={inputCls}
                      placeholder="MPV keluarga yang nyaman dan irit…"
                    />
                  </Label>

                  <Label text="Foto Mobil">
                    <label className="group flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line p-4 text-center transition hover:border-gold/60 hover:bg-gold/5">
                      <Upload size={20} className="text-muted group-hover:text-gold" />
                      <span className="text-xs font-bold">
                        {file ? file.name.slice(0, 32) : 'Klik untuk upload foto baru'}
                      </span>
                      <span className="text-[10px] text-muted">
                        {form.image_url
                          ? 'Foto lama tetap dipakai kalau tidak upload'
                          : 'JPG/PNG'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                      />
                    </label>
                  </Label>

                  {form.image_url && !file && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="h-24 w-full rounded-xl object-cover"
                    />
                  )}

                  {error && (
                    <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-500">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="flex w-full items-center justify-center gap-2 rounded-xl
                               bg-gradient-to-r from-brand-600 to-brand-500 py-3 text-sm font-bold text-white
                               shadow-xl transition hover:shadow-glow disabled:opacity-60"
                  >
                    {saving ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Menyimpan…
                      </>
                    ) : editId ? (
                      'Simpan Perubahan'
                    ) : (
                      'Tambah Mobil'
                    )}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2
                         rounded-3xl border border-line bg-bg p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-500/15 text-red-500">
                  <Trash2 size={20} />
                </span>
                <div>
                  <p className="font-bold">Hapus Mobil?</p>
                  <p className="text-xs text-muted">Tindakan ini tidak bisa dibatalkan.</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl border border-line py-2.5 text-sm font-bold transition hover:bg-line/30"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-line bg-bg/70 px-3 py-2.5 text-sm outline-none transition ' +
  'focus:border-gold focus:ring-2 focus:ring-gold/25 placeholder:text-muted/60';

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{text}</span>
      {children}
    </label>
  );
}