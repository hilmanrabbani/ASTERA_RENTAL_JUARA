'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ShieldAlert } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err) {
      setLoading(false);
      setError('Email atau password salah.');
      return;
    }

    router.replace('/admin');
    router.refresh();
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-bg px-5">
      {/* Background khusus admin */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid animate-gridMove opacity-40" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[140px]" />
        <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-gold/15 blur-[130px]" />
      </div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glow-card w-full max-w-md rounded-3xl border border-line bg-surface/70 p-8 backdrop-blur-2xl"
      >
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 shadow-lg">
            <Lock size={22} className="text-white" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold">Admin Portal</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-gold">
            Astera Rental Bandung
          </p>
        </div>

        <div className="space-y-4">
          <label className="relative block">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email admin"
              className="w-full rounded-xl border border-line bg-bg/70 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
          </label>

          <label className="relative block">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-xl border border-line bg-bg/70 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
          </label>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-500"
          >
            <ShieldAlert size={14} /> {error}
          </motion.p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl
                     bg-gradient-to-r from-brand-600 to-brand-500 py-3.5 text-sm font-bold text-white
                     shadow-xl transition hover:shadow-glow disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Memverifikasi…
            </>
          ) : (
            'Masuk Dashboard'
          )}
        </button>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-muted">
          Halaman ini bersifat privat. Akses tidak sah akan dicatat oleh sistem.
        </p>
      </motion.form>
    </main>
  );
}