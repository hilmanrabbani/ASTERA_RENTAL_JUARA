'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  Save,
  ReceiptText,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  MapPin,
  Phone,
  Calendar,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { rupiah, hitungDurasi } from '@/lib/utils';

interface Order {
  id: string;
  order_code: string;
  car_id: string | null;
  car_name: string;
  car_image: string | null;
  full_name: string;
  whatsapp: string;
  address: string | null;
  ktp_number: string | null;
  ktp_photo_url: string | null;
  selfie_photo_url: string | null;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  duration_days: number;
  service_type: 'lepas_kunci' | 'dengan_sopir';
  price_per_day: number;
  total_price: number;
  status: 'pending' | 'approved' | 'rejected' | 'done';
  admin_notes: string | null;
  created_at: string;
}

const STATUS_LIST: Array<{
  value: Order['status'];
  label: string;
  color: string;
  icon: typeof Clock;
}> = [
  { value: 'pending', label: 'Pending', color: 'border-amber-500/50 bg-amber-500/10 text-amber-500', icon: Clock },
  { value: 'approved', label: 'Setujui', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500', icon: CheckCircle2 },
  { value: 'rejected', label: 'Tolak', color: 'border-red-500/50 bg-red-500/10 text-red-500', icon: XCircle },
  { value: 'done', label: 'Selesai', color: 'border-brand-500/50 bg-brand-500/10 text-brand-500', icon: CheckCircle2 },
];

export default function AdminTransaksiDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ktpSigned, setKtpSigned] = useState<string>('');
  const [selfieSigned, setSelfieSigned] = useState<string>('');

  const [form, setForm] = useState({
    full_name: '',
    whatsapp: '',
    address: '',
    ktp_number: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    service_type: 'lepas_kunci' as 'lepas_kunci' | 'dengan_sopir',
    admin_notes: '',
    status: 'pending' as Order['status'],
  });

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const o = data as Order;
      setOrder(o);
      setForm({
        full_name: o.full_name,
        whatsapp: o.whatsapp,
        address: o.address ?? '',
        ktp_number: o.ktp_number ?? '',
        start_date: o.start_date,
        start_time: o.start_time,
        end_date: o.end_date,
        end_time: o.end_time,
        service_type: o.service_type,
        admin_notes: o.admin_notes ?? '',
        status: o.status,
      });

      // Ambil signed URL untuk foto KTP & selfie (bucket private)
      if (o.ktp_photo_url) {
        const { data } = await supabase.storage
          .from('ktp-documents')
          .createSignedUrl(o.ktp_photo_url, 3600);
        if (data) setKtpSigned(data.signedUrl);
      }
      if (o.selfie_photo_url) {
        const { data } = await supabase.storage
          .from('ktp-documents')
          .createSignedUrl(o.selfie_photo_url, 3600);
        if (data) setSelfieSigned(data.signedUrl);
      }

      setLoading(false);
    })();
  }, [params.id]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    const supabase = createClient();
    const newDurasi = hitungDurasi(form.start_date, form.start_time, form.end_date, form.end_time);
    const newTotal = newDurasi * (order?.price_per_day ?? 0);

    const { error: err } = await supabase
      .from('orders')
      .update({
        full_name: form.full_name,
        whatsapp: form.whatsapp,
        address: form.address,
        ktp_number: form.ktp_number,
        start_date: form.start_date,
        start_time: form.start_time,
        end_date: form.end_date,
        end_time: form.end_time,
        service_type: form.service_type,
        admin_notes: form.admin_notes,
        status: form.status,
        duration_days: newDurasi,
        total_price: newTotal,
      })
      .eq('id', params.id);

    setSaving(false);

    if (err) {
      setError(err.message);
      return;
    }

    setSuccess('Perubahan berhasil disimpan!');
    if (order) {
      setOrder({
        ...order,
        ...form,
        duration_days: newDurasi,
        total_price: newTotal,
      });
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center">
        <p className="text-xl font-bold">Pesanan tidak ditemukan</p>
        <Link
          href="/admin/transaksi"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft size={16} /> Kembali
        </Link>
      </div>
    );
  }

  const waLink = `https://wa.me/${order.whatsapp.replace(/\D/g, '').replace(/^0/, '62')}`;

  return (
    <div>
      {/* Header */}
      <Link
        href="/admin/transaksi"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
      >
        <ArrowLeft size={14} /> Kembali ke Transaksi
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Detail Pesanan</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-extrabold tracking-wider text-gold">{order.order_code}</span>
            <span className="text-xs text-muted">
              Dibuat: {new Date(order.created_at).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-bold text-white transition hover:shadow-glow"
        >
          <Phone size={15} /> Chat Customer
        </a>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT — Form Edit */}
        <div className="space-y-6">
          {/* Data Customer */}
          <Card title="Data Customer" icon={<User size={15} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama Lengkap">
                <input
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="WhatsApp">
                <input
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Alamat" className="mt-4">
              <textarea
                rows={2}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Nomor KTP" className="mt-4">
              <input
                maxLength={16}
                value={form.ktp_number}
                onChange={(e) =>
                  setForm({ ...form, ktp_number: e.target.value.replace(/\D/g, '') })
                }
                className={inputCls}
              />
            </Field>
          </Card>

          {/* Jadwal */}
          <Card title="Jadwal Sewa" icon={<Calendar size={15} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tanggal Mulai">
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Jam Mulai">
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Tanggal Selesai">
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Jam Selesai">
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-muted">Layanan</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(
                  [
                    ['lepas_kunci', 'Lepas Kunci'],
                    ['dengan_sopir', 'Dengan Sopir'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setForm({ ...form, service_type: val })}
                    className={`rounded-xl border-2 py-3 text-sm font-bold transition ${
                      form.service_type === val
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-line text-muted hover:border-gold/50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Catatan Admin */}
          <Card title="Catatan Admin" icon={<AlertCircle size={15} />}>
            <textarea
              rows={3}
              value={form.admin_notes}
              onChange={(e) => setForm({ ...form, admin_notes: e.target.value })}
              placeholder="Contoh: Sudah diverifikasi, jemput di Stasiun Bandung jam 09.00"
              className={inputCls}
            />
          </Card>

          {/* Error / Success */}
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500">
              {success}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex w-full items-center justify-center gap-2 rounded-xl
                       bg-gradient-to-r from-brand-600 to-brand-500 py-4 text-sm font-bold text-white
                       shadow-xl transition hover:shadow-glow disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Menyimpan…
              </>
            ) : (
              <>
                <Save size={17} /> Simpan Semua Perubahan
              </>
            )}
          </button>
        </div>

        {/* RIGHT — Status, KTP, Info */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:h-fit">
          {/* Status */}
          <Card title="Status Pesanan" icon={<Clock size={15} />}>
            <div className="grid gap-2">
              {STATUS_LIST.map((s) => {
                const Icon = s.icon;
                const active = form.status === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setForm({ ...form, status: s.value })}
                    className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-bold transition ${
                      active ? s.color : 'border-line text-muted hover:border-line/80'
                    }`}
                  >
                    <Icon size={16} />
                    {s.label}
                    {active && <CheckCircle2 size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Ringkasan */}
          <Card title="Ringkasan" icon={<ReceiptText size={15} />}>
            <div className="space-y-2 text-sm">
              <Row label="Mobil" value={order.car_name} />
              <Row label="Harga / hari" value={rupiah(order.price_per_day)} />
              <Row label="Durasi" value={`${order.duration_days} hari`} />
              <div className="my-2 border-t border-dashed border-line" />
              <Row
                label="Total"
                value={rupiah(order.total_price)}
                valueClass="text-gold font-extrabold"
              />
            </div>
          </Card>

          {/* Foto KTP */}
          <Card title="Verifikasi Identitas" icon={<CreditCard size={15} />}>
            {ktpSigned ? (
              <div>
                <p className="mb-2 text-xs font-semibold text-muted">Foto KTP</p>
                <a href={ktpSigned} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ktpSigned}
                    alt="KTP"
                    className="h-40 w-full object-cover transition group-hover:scale-105"
                  />
                </a>
                <a
                  href={ktpSigned}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-brand-500 hover:text-gold"
                >
                  <ExternalLink size={11} /> Buka di tab baru
                </a>
              </div>
            ) : (
              <p className="text-xs text-muted">Foto KTP tidak tersedia.</p>
            )}

            {selfieSigned && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold text-muted">Selfie + KTP</p>
                <a href={selfieSigned} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-xl border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selfieSigned}
                    alt="Selfie"
                    className="h-40 w-full object-cover transition group-hover:scale-105"
                  />
                </a>
              </div>
            )}

            <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-500/10 p-3 text-[11px] text-muted">
              <AlertCircle size={13} className="mt-0.5 shrink-0 text-brand-500" />
              Foto KTP bersifat rahasia. Link berlaku 1 jam, diperbarui otomatis saat refresh.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm outline-none transition ' +
  'focus:border-gold focus:ring-2 focus:ring-gold/25 placeholder:text-muted/60';

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur-xl">
      <h2 className="mb-4 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gold">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  className = '',
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-muted">{label}</span>
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-xs font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}