'use client';

import { useEffect, useState } from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Send,
  CheckCircle2,
  Instagram,
  Sparkles,
  ShieldCheck,
  Clock,
  Loader2,
} from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { WhatsappIcon } from '@/components/ui/Icons';
import { CONTACT, IG_LINK, MAIL_LINK, WA_LINK } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_ABOUT =
  'Astera Rental Bandung hadir sejak 2019 sebagai penyedia jasa sewa mobil yang mengutamakan kenyamanan, keamanan, dan transparansi harga. Seluruh unit kami rutin diservis dan dibersihkan sebelum diserahkan kepada pelanggan. Dengan tim yang siaga 24 jam, perjalanan Anda di Bandung dan sekitarnya menjadi lebih tenang.';

export default function TentangPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nama: '', email: '', pesan: '' });
  const [about, setAbout] = useState(DEFAULT_ABOUT);
  const [loadingAbout, setLoadingAbout] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('site_content')
        .select('value')
        .eq('key', 'about_desc')
        .maybeSingle();

      if (data?.value) {
        const v = data.value as { text?: string };
        if (v.text) setAbout(v.text);
      }
      setLoadingAbout(false);
    })();
  }, []);

  const kirim = (e: React.FormEvent) => {
    e.preventDefault();
    const body = encodeURIComponent(
      `Nama: ${form.nama}\nEmail: ${form.email}\n\n${form.pesan}`
    );
    window.location.href = `${MAIL_LINK.split('?')[0]}?subject=Kontak%20dari%20Website&body=${body}`;
    setSent(true);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
      {/* Header */}
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold backdrop-blur">
          <Sparkles size={13} /> Tentang Kami
        </span>

        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">
          Tentang <span className="text-gold">Astera Rental</span>
        </h1>

        {loadingAbout ? (
          <div className="mt-4 flex items-center gap-2 text-muted">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Memuat…</span>
          </div>
        ) : (
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{about}</p>
        )}
      </Reveal>

      {/* Trust badges */}
      <Reveal delay={0.1}>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, t: 'Armada Terawat', s: 'Servis rutin & bersih' },
            { icon: Clock, t: 'Layanan 24 Jam', s: 'Respon cepat kapan saja' },
            { icon: Sparkles, t: 'Harga Transparan', s: 'Tanpa biaya tersembunyi' },
          ].map((b) => (
            <li
              key={b.t}
              className="glow-card flex items-center gap-3 rounded-2xl border border-line bg-surface/50 p-4 backdrop-blur"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                <b.icon size={19} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold">{b.t}</span>
                <span className="block text-xs text-muted">{b.s}</span>
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        {/* Info Kontak */}
        <Reveal>
          <div className="space-y-4">
            {[
              { icon: MapPin, label: 'Alamat', value: CONTACT.address, href: CONTACT.mapsUrl },
              { icon: Phone, label: 'WhatsApp', value: CONTACT.whatsappDisplay, href: WA_LINK },
              { icon: Mail, label: 'Email', value: CONTACT.email, href: MAIL_LINK },
            ].map((it) => (
              <a
                key={it.label}
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-card flex items-start gap-4 rounded-2xl border border-line bg-surface/60 p-5 backdrop-blur-xl transition hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <it.icon size={19} />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-widest text-gold">
                    {it.label}
                  </span>
                  <span className="mt-1 block text-sm">{it.value}</span>
                </span>
              </a>
            ))}

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-xs font-bold text-white transition hover:shadow-glow"
              >
                <WhatsappIcon size={15} /> Chat WhatsApp
              </a>
              <a
                href={IG_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-xs font-bold transition hover:border-gold hover:text-gold"
              >
                <Instagram size={15} /> @astera.bdg
              </a>
            </div>

            {/* Maps */}
            <div className="mt-6 overflow-hidden rounded-3xl border border-line">
              <iframe
                title="Lokasi Astera Rental Bandung"
                src="https://www.google.com/maps?q=Bandung&output=embed"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          </div>
        </Reveal>

        {/* Form Kontak */}
        <Reveal delay={0.15}>
          <form
            onSubmit={kirim}
            className="glow-card rounded-3xl border border-line bg-surface/60 p-6 backdrop-blur-xl sm:p-8"
          >
            <h2 className="text-lg font-extrabold">Kirim Pesan</h2>
            <p className="mt-1 text-sm text-muted">Kami akan membalas dalam 1×24 jam.</p>

            <div className="mt-6 space-y-4">
              <input
                required
                placeholder="Nama lengkap"
                value={form.nama}
                onChange={(e) => setForm({ ...form, nama: e.target.value })}
                className="w-full rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25 placeholder:text-muted/60"
              />
              <input
                required
                type="email"
                placeholder="Alamat email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25 placeholder:text-muted/60"
              />
              <textarea
                required
                rows={5}
                placeholder="Tulis pesan Anda…"
                value={form.pesan}
                onChange={(e) => setForm({ ...form, pesan: e.target.value })}
                className="w-full rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25 placeholder:text-muted/60"
              />
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 py-3.5 text-sm font-bold text-white shadow-xl transition hover:shadow-glow"
            >
              {sent ? (
                <>
                  <CheckCircle2 size={17} /> Email Terbuka
                </>
              ) : (
                <>
                  <Send size={17} /> Kirim Pesan
                </>
              )}
            </button>

            <p className="mt-4 text-center text-[11px] text-muted">
              Form akan membuka aplikasi email default Anda dengan pesan yang sudah terisi.
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}