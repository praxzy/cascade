import type React from 'react';

import type { Metadata } from 'next';

import { Analytics } from '@vercel/analytics/next';

import './globals.css';

import { Geist, Geist_Mono, Source_Serif_4 } from 'next/font/google';

import { AppProviders } from '@/components/app-providers';
import { Toaster } from '@/components/ui/sonner';

// Initialize fonts
const _geist = Geist({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
const _geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});
const _sourceSerif_4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Cascade',
  description: 'Manage your payment streams with Cascade',
  generator: 'Cascade',
  applicationName: 'Cascade',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.ico',
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`font-sans antialiased`}>
        <AppProviders>
          {children}
          <Toaster />
          <Analytics />
        </AppProviders>
      </body>
    </html>
  );
}
