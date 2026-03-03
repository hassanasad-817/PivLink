import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PrivyProvider } from '@/components/PrivyProvider';
import { ToastProvider } from '@/components/Toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const faviconSvg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="%230055FF"/><text x="16" y="22" font-size="18" text-anchor="middle" fill="white" font-family="sans-serif">P</text></svg>');

export const metadata: Metadata = {
  title: 'PivLink — The Global Financial Bridge',
  description: 'Borderless, instant, and secure payment infrastructure for the global workforce. Powered by Solana.',
  icons: { icon: faviconSvg },
  openGraph: {
    title: 'PivLink — The Global Financial Bridge',
    description: 'Settle cross-border payments in ~400ms with smart contract escrow on Solana.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <PrivyProvider>
          <ToastProvider>{children}</ToastProvider>
        </PrivyProvider>
      </body>
    </html>
  );
}
