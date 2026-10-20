'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Clock, Wrench, CheckCircle2 } from 'lucide-react';
import type { Car } from '@/lib/dummyCars';
import type { Rental } from '@/lib/store';
import { rupiah } from '@/lib/utils';

export default function OrderSummary({
  car,
  rental,
  durasi,
  total,
}: {
  car: Car;
  rental: Rental;
  durasi: number;
  total: number;
}) {
  const isDenganSopir = rental.serviceType === 'dengan_sopir';
  const biayaPerHariSopir = car.biaya_sopir ?? 150000;
  const biayaSopir = isDenganSopir ? biayaPerHariSopir * durasi : 0;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="h-fit lg:sticky lg:top-28"
    >
      <div className="glow-card overflow-hidden rounded-3xl border border-line bg-surface/70 backdrop-blur-xl">
        {/* Foto mobil */}
        <div className="relative h-44 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={car.image_url}
            alt={car.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-4 text-white">
            <p className="text-[10px] uppercase tracking-widest text-gold">
              {car.category || 'Armada'}
            </p>
            <p className="text-lg font-extrabold">{car.name}</p>
          </div>
        </div>

        <div className="space-y-3 p-5 text-sm">
          <Row
            icon={<CalendarDays size={14} />}
            label="Mulai"
            value={`${rental.startDate} · ${rental.startTime}`}
          />
          <Row
            icon={<CalendarDays size={14} />}
            label="Selesai"
            value={`${rental.endDate} · ${rental.endTime}`}
          />
          <Row icon={<Clock size={14} />} label="Durasi" value={`${durasi} hari`} />
          <Row
            icon={<Wrench size={14} />}
            label="Layanan"
            value={isDenganSopir ? 'Dengan Sopir' : 'Lepas Kunci'}
          />

          <div className="my-3 border-t border-dashed border-line" />

          {/* Rincian Harga */}
          <div className="flex justify-between text-xs text-muted">
            <span>Harga / hari</span>
            <span>{rupiah(car.price_per_day)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Sewa {durasi} hari</span>
            <span>{rupiah(car.price_per_day * durasi)}</span>
          </div>

          {/* Baris Jasa Sopir — hanya muncul kalau "Dengan Sopir" */}
          {isDenganSopir && (
            <div className="flex justify-between text-xs font-semibold text-gold">
              <span>
                + Jasa Sopir ({durasi} × {rupiah(biayaPerHariSopir)})
              </span>
              <span>{rupiah(biayaSopir)}</span>
            </div>
          )}

          <div className="mt-3 flex items-end justify-between rounded-2xl bg-brand-500/10 p-4">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">Total</span>
            <motion.span
              key={total}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xl font-extrabold text-gold"
            >
              {rupiah(total)}
            </motion.span>
          </div>

          <ul className="mt-4 space-y-2 text-[11px] text-muted">
            {[
              'Tanpa biaya tersembunyi',
              'Konfirmasi admin < 15 menit',
              'Pembayaran setelah disetujui',
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CheckCircle2 size={13} className="text-emerald-500" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.aside>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-xs text-muted">
        {icon}
        {label}
      </span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}