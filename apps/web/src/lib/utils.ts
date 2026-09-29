import { CONTACT } from './constants';

export const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n || 0);

export function hitungDurasi(
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
) {
  if (!startDate || !endDate) return 0;
  const a = new Date(`${startDate}T${startTime || '00:00'}`);
  const b = new Date(`${endDate}T${endTime || '00:00'}`);
  const ms = b.getTime() - a.getTime();
  if (ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / 86_400_000));
}

export function kodePesanan() {
  const d = new Date();
  const tgl = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(
    d.getDate()
  ).padStart(2, '0')}`;
  return `AST-${tgl}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function waPesan(o: {
  order_code: string;
  full_name: string;
  whatsapp: string;
  car_name: string;
  duration_days: number;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  service_type: string;
  total_price: number;
}) {
  const teks = `Halo *Astera Rental Bandung* 🚗
Saya ingin mengkonfirmasi pesanan berikut:

*Kode Pesanan:* ${o.order_code}
*Nama:* ${o.full_name}
*No. WhatsApp:* ${o.whatsapp}
*Mobil:* ${o.car_name}
*Durasi:* ${o.duration_days} hari
*Mulai:* ${o.start_date} ${o.start_time}
*Selesai:* ${o.end_date} ${o.end_time}
*Layanan:* ${o.service_type === 'dengan_sopir' ? 'Dengan Sopir' : 'Lepas Kunci'}
*Total:* ${rupiah(o.total_price)}

Mohon diproses ya. Terima kasih! 🙏`;

  return `https://wa.me/${CONTACT.whatsappRaw}?text=${encodeURIComponent(teks)}`;
}