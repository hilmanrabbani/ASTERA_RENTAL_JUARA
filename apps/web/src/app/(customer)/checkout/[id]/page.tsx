'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Upload,
  Loader2,
  CreditCard,
  User,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import OrderSummary from '@/components/checkout/OrderSummary';
import type { Car } from '@/lib/dummyCars';
import { useBooking } from '@/lib/store';
import { hitungDurasi, kodePesanan, waPesan } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function CheckoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { rental, setRental, setCar, reset } = useBooking();

  const [car, setCarData] = useState<Car | null>(null);
  const [loadingCar, setLoadingCar] = useState(true);
  const [form, setForm] = useState({
    full_name: '',
    whatsapp: '',
    address: '',
    ktp_number: '',
  });
  const [ktpFile, setKtpFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ============ FETCH CAR ============
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) {
        console.error('Error fetch car:', error);
      } else if (data) {
        setCarData(data as Car);
        setCar(data as Car);
      }
      setLoadingCar(false);
    })();
  }, [params.id, setCar]);

  // ============ AUTO-SET "DENGAN SOPIR" kalau mobil wajib sopir ============
  useEffect(() => {
    if (car?.requires_driver && rental.serviceType === 'lepas_kunci') {
      setRental({ serviceType: 'dengan_sopir' });
    }
  }, [car, rental.serviceType, setRental]);

  // ============ HITUNG DURASI & TOTAL ============
  const durasi = useMemo(
    () => hitungDurasi(rental.startDate, rental.startTime, rental.endDate, rental.endTime),
    [rental]
  );

  // Biaya sopir PER MOBIL (bukan constant)
  const biayaPerHariSopir = car?.biaya_sopir ?? 150000;
  const hargaMobil = durasi * (car?.price_per_day ?? 0);
  const biayaSopir =
    rental.serviceType === 'dengan_sopir' ? durasi * biayaPerHariSopir : 0;
  const total = hargaMobil + biayaSopir;

  // ============ LOADING STATE ============
  if (loadingCar) {
    return (
      <section className="mx-auto grid min-h-[60vh] place-items-center px-5">
        <div className="flex flex-col items-center gap-3 text-muted">
          <Loader2 size={32} className="animate-spin text-gold" />
          <p className="text-sm">Memuat data mobil…</p>
        </div>
      </section>
    );
  }

  if (!car) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="text-xl font-bold">Mobil tidak ditemukan</p>
        <Link
          href="/katalog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-bold text-white"
        >
          <ArrowLeft size={16} /> Kembali ke Katalog
        </Link>
      </section>
    );
  }

  // ============ SUBMIT HANDLER ============
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!ktpFile || !selfieFile) {
      return setError('Foto KTP dan Selfie bersama KTP wajib diunggah.');
    }
    if (durasi < 1) {
      return setError('Tanggal selesai harus setelah tanggal mulai.');
    }
    if (form.ktp_number.length !== 16) {
      return setError('Nomor KTP harus 16 digit.');
    }

    // ==== VALIDASI JAM BOOKING (00:00 - 22:00) ====
    const startHour = parseInt(rental.startTime.split(':')[0]);
    const endHour = parseInt(rental.endTime.split(':')[0]);

    if (startHour < 0 || startHour > 22) {
      return setError('Jam mulai harus antara 00:00 - 22:00 WIB.');
    }
    if (endHour < 0 || endHour > 22) {
      return setError('Jam selesai harus antara 00:00 - 22:00 WIB.');
    }

    setLoading(true);
    const supabase = createClient();
    const kode = kodePesanan();

    try {
      const ktpPath = `orders/${kode}/ktp-${Date.now()}-${ktpFile.name.replace(/\s+/g, '_')}`;
      const { error: ktpErr } = await supabase.storage
        .from('ktp-documents')
        .upload(ktpPath, ktpFile, { upsert: false, cacheControl: '3600' });
      if (ktpErr) throw new Error(`Gagal upload KTP: ${ktpErr.message}`);

      const selfiePath = `orders/${kode}/selfie-${Date.now()}-${selfieFile.name.replace(/\s+/g, '_')}`;
      const { error: selfieErr } = await supabase.storage
        .from('ktp-documents')
        .upload(selfiePath, selfieFile, { upsert: false, cacheControl: '3600' });
      if (selfieErr) throw new Error(`Gagal upload Selfie: ${selfieErr.message}`);

      const { error: orderErr } = await supabase.from('orders').insert({
        order_code: kode,
        car_id: car.id,
        car_name: car.name,
        car_image: car.image_url,
        full_name: form.full_name,
        whatsapp: form.whatsapp,
        address: form.address,
        ktp_number: form.ktp_number,
        ktp_photo_url: ktpPath,
        selfie_photo_url: selfiePath,
        start_date: rental.startDate,
        start_time: rental.startTime,
        end_date: rental.endDate,
        end_time: rental.endTime,
        duration_days: durasi,
        service_type: rental.serviceType,
        price_per_day: car.price_per_day,
        total_price: total,
        status: 'pending',
      });
      if (orderErr) throw new Error(`Gagal simpan pesanan: ${orderErr.message}`);

      const url = waPesan({
        order_code: kode,
        full_name: form.full_name,
        whatsapp: form.whatsapp,
        car_name: car.name,
        duration_days: durasi,
        start_date: rental.startDate,
        start_time: rental.startTime,
        end_date: rental.endDate,
        end_time: rental.endTime,
        service_type: rental.serviceType,
        total_price: total,
      });
      window.open(url, '_blank', 'noopener');

      reset();
      router.push(`/checkout/sukses?kode=${kode}`);
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.');
      setLoading(false);
    }
  };

  // ============ OPSI LAYANAN (dynamic) ============
  const layananOpsi: Array<{
    value: 'lepas_kunci' | 'dengan_sopir';
    label: string;
    desc: string;
    biaya: number | null;
  }> = [
    { value: 'lepas_kunci', label: 'Lepas Kunci', desc: 'Anda menyetir sendiri', biaya: null },
    {
      value: 'dengan_sopir',
      label: 'Dengan Sopir',
      desc: 'Lebih praktis & aman',
      biaya: car.biaya_sopir ?? 150000,
    },
  ];

  const opsiFiltered = layananOpsi.filter((opt) => {
    if (car.requires_driver && opt.value === 'lepas_kunci') return false;
    return true;
  });

  return (
    <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <Link
          href="/katalog"
          className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-gold"
        >
          <ArrowLeft size={14} /> Kembali ke Katalog
        </Link>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
          Pemesanan <span className="text-gold">Mobil</span>
        </h1>
        <p className="mt-2 text-muted">
          Lengkapi data di bawah ini. Pesanan Anda akan langsung diteruskan ke Admin.
        </p>
      </motion.div>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card title="Data Diri" icon={<User size={17} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama Lengkap" required>
                <input
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                  placeholder="Sesuai KTP"
                  className={inputCls}
                />
              </Field>
              <Field label="Nomor WhatsApp" required>
                <input
                  required
                  inputMode="tel"
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="Alamat Domisili" required className="mt-4">
              <textarea
                required
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Jalan, No. Rumah, Kelurahan, Kota"
                className={inputCls}
              />
            </Field>
          </Card>

          <Card title="Jadwal & Layanan" icon={<ShieldCheck size={17} />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tanggal Mulai" required>
                <input
                  type="date"
                  required
                  value={rental.startDate}
                  onChange={(e) => setRental({ startDate: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Jam Mulai" required>
                <input
                  type="time"
                  required
                  min="00:00"
                  max="22:00"
                  value={rental.startTime}
                  onChange={(e) => setRental({ startTime: e.target.value })}
                  className={inputCls}
                />
                <span className="mt-1 block text-[11px] text-muted">
                  ⏰ Jam operasional: 00:00 - 22:00 WIB
                </span>
              </Field>
              <Field label="Tanggal Selesai" required>
                <input
                  type="date"
                  required
                  value={rental.endDate}
                  onChange={(e) => setRental({ endDate: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="Jam Selesai" required>
                <input
                  type="time"
                  required
                  min="00:00"
                  max="22:00"
                  value={rental.endTime}
                  onChange={(e) => setRental({ endTime: e.target.value })}
                  className={inputCls}
                />
                <span className="mt-1 block text-[11px] text-muted">
                  ⏰ Jam operasional: 00:00 - 22:00 WIB
                </span>
              </Field>
            </div>

            <p className="mt-4 text-sm font-semibold">Opsi Layanan</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {opsiFiltered.map((opt) => {
                const isActive = rental.serviceType === opt.value;
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setRental({ serviceType: opt.value })}
                    className={`relative rounded-2xl border-2 p-4 text-left transition ${
                      isActive
                        ? 'border-gold bg-gold/10 shadow-glow'
                        : 'border-line hover:border-gold/50'
                    }`}
                  >
                    <span className="block text-sm font-bold">{opt.label}</span>
                    <span className="block text-xs text-muted">{opt.desc}</span>
                    {opt.biaya !== null && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-lg bg-gold/15 px-2 py-0.5 text-[11px] font-bold text-gold">
                        + Rp {opt.biaya.toLocaleString('id-ID')}/hari
                      </span>
                    )}
                    {car.requires_driver && opt.value === 'dengan_sopir' && (
                      <span className="mt-1 block text-[10px] font-semibold text-amber-500">
                        ⚠️ Wajib sopir untuk unit ini
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          <Card title="Verifikasi Identitas" icon={<CreditCard size={17} />}>
            <Field label="Nomor KTP" required>
              <input
                required
                inputMode="numeric"
                maxLength={16}
                value={form.ktp_number}
                onChange={(e) =>
                  setForm({ ...form, ktp_number: e.target.value.replace(/\D/g, '') })
                }
                placeholder="16 digit NIK"
                className={inputCls}
              />
            </Field>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <UploadBox
                label="Upload Foto KTP"
                hint="JPG/PNG maks 5MB"
                file={ktpFile}
                onChange={setKtpFile}
              />
              <UploadBox
                label="Selfie bersama KTP"
                hint="Wajah & KTP terlihat jelas"
                file={selfieFile}
                onChange={setSelfieFile}
              />
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-xl bg-brand-500/10 p-3 text-xs text-muted">
              <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-500" />
              Data identitas Anda dienkripsi dan hanya digunakan untuk keperluan verifikasi
              penyewaan.
            </p>
          </Card>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl
                       bg-gradient-to-r from-brand-600 to-brand-500 py-4 text-sm font-bold text-white
                       shadow-xl transition hover:shadow-glow disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Memproses…
              </>
            ) : (
              'Konfirmasi & Kirim ke WhatsApp'
            )}
          </button>
        </form>

        <OrderSummary car={car} rental={rental} durasi={durasi} total={total} />
      </div>
    </section>
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
    <div className="rounded-3xl border border-line bg-surface/60 p-6 backdrop-blur-xl">
      <h2 className="mb-5 flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider text-gold">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  className = '',
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-semibold text-muted">
        {label} {required && <span className="text-gold">*</span>}
      </span>
      {children}
    </label>
  );
}

function UploadBox({
  label,
  hint,
  file,
  onChange,
}: {
  label: string;
  hint: string;
  file: File | null;
  onChange: (f: File) => void;
}) {
  return (
    <label
      className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl
        border-2 border-dashed p-6 text-center transition
        ${file ? 'border-gold bg-gold/10' : 'border-line hover:border-gold/60 hover:bg-gold/5'}`}
    >
      <Upload size={22} className={file ? 'text-gold' : 'text-muted group-hover:text-gold'} />
      <span className="text-xs font-bold">{file ? file.name.slice(0, 28) : label}</span>
      <span className="text-[11px] text-muted">{hint}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
      />
    </label>
  );
}