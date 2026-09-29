import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import Accordion from '@/components/ui/Accordion';
import Reveal from '@/components/ui/Reveal';
import { WhatsappIcon } from '@/components/ui/Icons';
import { WA_LINK } from '@/lib/constants';

const FAQ = [
  {
    q: 'Apa saja syarat menyewa mobil di Astera Rental?',
    a: 'Cukup KTP asli, SIM A yang masih berlaku, dan deposit ringan. Untuk layanan dengan sopir, SIM tidak diwajibkan. Kami juga meminta foto selfie bersama KTP untuk verifikasi keamanan.',
  },
  {
    q: 'Berapa lama proses konfirmasi pesanan?',
    a: 'Rata-rata di bawah 15 menit pada jam operasional (08.00 – 22.00 WIB). Anda akan dihubungi melalui WhatsApp untuk verifikasi data dan ketersediaan unit.',
  },
  {
    q: 'Apakah bisa lepas kunci ke luar kota?',
    a: 'Bisa, dengan konfirmasi tambahan dan biaya luar kota yang disesuaikan jarak tempuh. Untuk perjalanan jauh, kami menyarankan layanan dengan sopir demi keamanan bersama.',
  },
  {
    q: 'Bagaimana metode pembayarannya?',
    a: 'Transfer bank (BCA, Mandiri, BRI) atau e-wallet (GoPay, OVO, DANA). Pembayaran dilakukan setelah pesanan disetujui admin dan sebelum unit diserahkan.',
  },
  {
    q: 'Apakah harga sudah termasuk BBM dan tol?',
    a: 'Untuk paket lepas kunci, BBM dan tol ditanggung penyewa. Untuk paket dengan sopir, biaya BBM & tol dihitung terpisah sesuai rute perjalanan.',
  },
  {
    q: 'Apakah ada biaya pembatalan?',
    a: 'Pembatalan gratis hingga 24 jam sebelum jadwal pengambilan unit. Pembatalan di bawah 24 jam dikenakan biaya 25% dari total sewa.',
  },
];

export const metadata = {
  title: 'FAQ',
  description: 'Pertanyaan yang sering diajukan seputar rental mobil Astera Bandung.',
};

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
          <HelpCircle size={13} /> Pusat Bantuan
        </span>

        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
          Pertanyaan yang <span className="text-gold">Sering Diajukan</span>
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Belum menemukan jawaban yang Anda cari? Hubungi kami langsung via WhatsApp — admin siap
          membantu 24 jam.
        </p>
      </Reveal>

      <div className="mt-9">
        <Accordion items={FAQ} />
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 rounded-3xl border border-line bg-surface/60 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-lg font-extrabold">Masih ada pertanyaan?</h2>
          <p className="mt-1 text-sm text-muted">
            Chat langsung ke admin kami — respons cepat di jam operasional.
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white transition hover:shadow-glow"
          >
            <WhatsappIcon size={17} /> Tanya Admin via WhatsApp
          </a>
        </div>
      </Reveal>
    </section>
  );
}