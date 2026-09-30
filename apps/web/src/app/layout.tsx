import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://astera-rental-juara.vercel.app'
  ),
  title: {
    default: 'Astera Rental Bandung — Sewa Mobil Nyaman & Elegan',
    template: '%s · Astera Rental',
  },
  description:
    'Rental mobil terpercaya di Bandung. Armada lengkap, harga transparan, layanan lepas kunci & dengan sopir.',
  keywords: [
    'rental mobil bandung',
    'sewa mobil bandung',
    'astera rental',
    'rental mobil murah',
  ],
  authors: [{ name: 'Astera Rental Bandung' }],
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'Astera Rental Bandung',
    title: 'Astera Rental Bandung — Sewa Mobil Nyaman & Elegan',
    description:
      'Rental mobil terpercaya di Bandung. Armada lengkap, harga transparan, layanan lepas kunci & dengan sopir.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Astera Rental Bandung',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Astera Rental Bandung — Sewa Mobil Nyaman & Elegan',
    description:
      'Rental mobil terpercaya di Bandung. Armada lengkap, harga transparan.',
    images: ['/og-image.png'],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={jakarta.variable}>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}