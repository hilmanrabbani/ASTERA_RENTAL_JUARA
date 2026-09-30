'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2,
  Save,
  Type,
  HelpCircle,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Faq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

export default function AdminKontenPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Hero content
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [aboutDesc, setAboutDesc] = useState('');

  // FAQ
  const [faqs, setFaqs] = useState<Faq[]>([]);

  useEffect(() => {
    (async () => {
      const supabase = createClient();

      const [content, faqRes] = await Promise.all([
        supabase.from('site_content').select('*'),
        supabase.from('faqs').select('*').order('sort_order', { ascending: true }),
      ]);

      const contentData = content.data ?? [];
      const getVal = (key: string) => {
        const item = contentData.find((c) => c.key === key);
        return (item?.value as { text?: string } | undefined)?.text ?? '';
      };

      setHeroTitle(getVal('hero_title'));
      setHeroSubtitle(getVal('hero_subtitle'));
      setAboutDesc(getVal('about_desc'));
      setFaqs((faqRes.data as Faq[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    const supabase = createClient();

    try {
      // Upsert site_content
      const upserts = [
        { key: 'hero_title', value: { text: heroTitle } },
        { key: 'hero_subtitle', value: { text: heroSubtitle } },
        { key: 'about_desc', value: { text: aboutDesc } },
      ];

      for (const u of upserts) {
        const { error: err } = await supabase
          .from('site_content')
          .upsert({ key: u.key, value: u.value, updated_at: new Date().toISOString() });
        if (err) throw err;
      }

      // Update FAQ (delete + insert — paling simpel)
      const { error: delErr } = await supabase.from('faqs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (delErr) throw delErr;

      if (faqs.length > 0) {
        const faqPayload = faqs.map((f, idx) => ({
          question: f.question,
          answer: f.answer,
          sort_order: idx + 1,
        }));
        const { error: insErr } = await supabase.from('faqs').insert(faqPayload);
        if (insErr) throw insErr;
      }

      setSuccess('Konten berhasil disimpan!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  const addFaq = () => {
    setFaqs([...faqs, { id: crypto.randomUUID(), question: '', answer: '', sort_order: faqs.length + 1 }]);
  };

  const removeFaq = (id: string) => {
    setFaqs(faqs.filter((f) => f.id !== id));
  };

  const updateFaq = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  if (loading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">Konten Web</h1>
          <p className="mt-1 text-sm text-muted">
            Ubah teks sambutan dan FAQ tanpa perlu menyentuh kode.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500
                     px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:shadow-glow disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Menyimpan…
            </>
          ) : (
            <>
              <Save size={16} /> Simpan Semua
            </>
          )}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500"
        >
          {error}
        </motion.div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-500"
        >
          <CheckCircle2 size={16} /> {success}
        </motion.div>
      )}

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-8 rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-xl"
      >
        <h2 className="mb-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gold">
          <Type size={15} /> Teks Hero (Halaman Utama)
        </h2>

        <div className="space-y-4">
          <Label text="Judul Hero">
            <input
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className={inputCls}
              placeholder="Selamat Datang di Astera Rental Bandung"
            />
          </Label>

          <Label text="Sub-Judul Hero">
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className={inputCls}
              placeholder="Solusi Perjalanan Nyaman & Elegan Anda"
            />
          </Label>

          <Label text="Deskripsi Tentang (Halaman Tentang)">
            <textarea
              rows={4}
              value={aboutDesc}
              onChange={(e) => setAboutDesc(e.target.value)}
              className={inputCls}
              placeholder="Astera Rental Bandung hadir sejak 2019…"
            />
          </Label>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-6 rounded-2xl border border-line bg-surface/60 p-6 backdrop-blur-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gold">
            <HelpCircle size={15} /> FAQ ({faqs.length})
          </h2>
          <button
            onClick={addFaq}
            className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-bold transition hover:border-gold hover:text-gold"
          >
            <Plus size={13} /> Tambah FAQ
          </button>
        </div>

        {faqs.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">
            Belum ada FAQ. Klik &quot;Tambah FAQ&quot; untuk menambahkan.
          </p>
        ) : (
          <div className="space-y-4">
            {faqs.map((f, idx) => (
              <div
                key={f.id}
                className="rounded-xl border border-line bg-bg/50 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-muted">FAQ #{idx + 1}</span>
                  <button
                    onClick={() => removeFaq(f.id)}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-red-500/40 text-red-500 transition hover:bg-red-500/10"
                    aria-label="Hapus FAQ"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <input
                  value={f.question}
                  onChange={(e) => updateFaq(f.id, 'question', e.target.value)}
                  placeholder="Pertanyaan…"
                  className={`${inputCls} mt-3`}
                />
                <textarea
                  rows={2}
                  value={f.answer}
                  onChange={(e) => updateFaq(f.id, 'answer', e.target.value)}
                  placeholder="Jawaban…"
                  className={`${inputCls} mt-2`}
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Save Button Bottom */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl
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
  );
}

const inputCls =
  'w-full rounded-xl border border-line bg-bg/70 px-4 py-3 text-sm outline-none transition ' +
  'focus:border-gold focus:ring-2 focus:ring-gold/25 placeholder:text-muted/60';

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-muted">{text}</span>
      {children}
    </label>
  );
}