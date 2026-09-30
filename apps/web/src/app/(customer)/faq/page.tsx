'use client';

import { useEffect, useState } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import Accordion, { type AccordionItem } from '@/components/ui/Accordion';
import Reveal from '@/components/ui/Reveal';
import { WhatsappIcon } from '@/components/ui/Icons';
import { WA_LINK } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

const FALLBACK_FAQ: AccordionItem[] = [
  {
    q: 'Apa saja syarat menyewa mobil di Astera Rental?',
    a: 'Cukup KTP asli, SIM A yang masih berlaku, dan deposit ringan.',
  },
  {
    q: 'Berapa lama proses konfirmasi pesanan?',
    a: 'Rata-rata di bawah 15 menit pada jam operasional (08.00 – 22.00 WIB).',
  },
];

export default function FaqPage() {
  const [faqs, setFaqs] = useState<AccordionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faqs')
        .select('question, answer')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetch faqs:', error);
        setFaqs(FALLBACK_FAQ);
      } else {
        const items = (data ?? []).map((f) => ({
          q: f.question as string,
          a: f.answer as string,
        }));
        setFaqs(items.length > 0 ? items : FALLBACK_FAQ);
      }
      setLoading(false);
    })();
  }, []);

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
        {loading ? (
          <div className="grid place-items-center py-20">
            <Loader2 size={32} className="animate-spin text-gold" />
          </div>
        ) : (
          <Accordion items={faqs} />
        )}
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