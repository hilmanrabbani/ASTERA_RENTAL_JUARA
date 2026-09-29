import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Astera Rental Bandung — Sewa Mobil Nyaman & Elegan',
    template: '%s · Astera Rental',
  },
  description:
    'Rental mobil terpercaya di Bandung. Armada lengkap, harga transparan, layanan lepas kunci & dengan sopir.',
  keywords: ['rental mobil bandung', 'sewa mobil bandung', 'astera rental'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}