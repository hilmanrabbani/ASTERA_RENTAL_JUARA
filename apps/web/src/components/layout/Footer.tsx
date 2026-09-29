import Link from 'next/link';
import { Car, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { WhatsappIcon } from '@/components/ui/Icons';
import { CONTACT, IG_LINK, MAIL_LINK, WA_LINK } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-surface/60 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800">
              <Car size={20} className="text-white" />
            </span>
            <span className="font-extrabold">Astera Rental</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Solusi perjalanan nyaman &amp; elegan di Bandung. Armada terawat, harga transparan,
            pelayanan 24 jam.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Navigasi</h4>
          <ul className="space-y-2 text-sm text-muted">
            {[
              ['/', 'Home'],
              ['/katalog', 'Katalog Mobil'],
              ['/faq', 'FAQ'],
              ['/tentang', 'Tentang & Kontak'],
            ].map(([h, l]) => (
              <li key={h}>
                <Link href={h} className="transition hover:text-gold">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Kontak</h4>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-500" />
              {CONTACT.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-brand-500" />
              {CONTACT.whatsappDisplay}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-brand-500" />
              <a href={MAIL_LINK} className="transition hover:text-gold">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-widest text-gold">Ikuti Kami</h4>
          <div className="flex gap-3">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid h-11 w-11 place-items-center rounded-xl border border-line text-emerald-500 transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-glow"
            >
              <WhatsappIcon size={18} />
            </a>
            <a
              href={IG_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-11 w-11 place-items-center rounded-xl border border-line text-pink-500 transition hover:-translate-y-1 hover:border-pink-500 hover:shadow-glow"
            >
              <Instagram size={18} />
            </a>
            <a
              href={MAIL_LINK}
              aria-label="Email"
              className="grid h-11 w-11 place-items-center rounded-xl border border-line text-red-500 transition hover:-translate-y-1 hover:border-red-500 hover:shadow-glow"
            >
              <Mail size={18} />
            </a>
          </div>
          <p className="mt-5 text-xs text-muted">Layanan 24/7 · Respons cepat via WhatsApp</p>
        </div>
      </div>

      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Astera Rental Bandung. Semua hak dilindungi.
      </div>
    </footer>
  );
}