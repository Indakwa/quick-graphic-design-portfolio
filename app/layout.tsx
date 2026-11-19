import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import { site } from '@/lib/content';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const title = `${site.name} — ${site.role}, ${site.city}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: site.intro,
  openGraph: {
    title,
    description: site.intro,
    url: '/',
    siteName: site.name,
    type: 'website',
    locale: 'en_KE',
  },
  twitter: { card: 'summary_large_image', title, description: site.intro },
};

export const viewport: Viewport = {
  themeColor: '#F4F2EE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body>{children}</body>
    </html>
  );
}
