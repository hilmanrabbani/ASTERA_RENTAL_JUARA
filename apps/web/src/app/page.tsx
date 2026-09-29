export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-bg text-content">
      {/* Background grid */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-60" />

      {/* Gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-40 -top-40 -z-10 h-[36rem] w-[36rem] rounded-full bg-brand-500/25 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -right-32 top-1/4 -z-10 h-[30rem] w-[30rem] rounded-full bg-gold/15 blur-[130px]"
      />

      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          ✨ Rental Mobil Premium Bandung
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-6xl">
          Selamat Datang di{' '}
          <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-gold bg-clip-text text-transparent">
            Astera Rental
          </span>{' '}
          Bandung
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Solusi Perjalanan Nyaman &amp; Elegan Anda. Pilih armada favorit, isi data, dan mobil siap
          diantar ke lokasi Anda.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/katalog"
            className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl transition hover:shadow-glow"
          >
            Jelajahi Mobil
          </a>
          <a
            href="/katalog"
            className="rounded-full border border-line bg-surface/60 px-7 py-3.5 text-sm font-bold backdrop-blur transition hover:border-gold hover:text-gold"
          >
            Sewa Sekarang
          </a>
        </div>
      </section>
    </main>
  );
}