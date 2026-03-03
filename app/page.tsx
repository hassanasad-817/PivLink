'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaAddress } from '@/lib/privy';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { useRouter } from 'next/navigation';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] } }),
};

const stats = [
  { value: '~400ms', label: 'Settlement speed' },
  { value: '~4–5%', label: 'Total fees' },
  { value: '0', label: 'US entity required' },
  { value: '∞', label: 'Countries supported' },
];

const steps = [
  { step: 1, label: 'Sign in with email', sub: 'Get your embedded Solana wallet automatically', icon: '📧' },
  { step: 2, label: 'Create invoice', sub: 'Set amount & release password in seconds', icon: '📄' },
  { step: 3, label: 'Share pay link', sub: 'Client pays with card or crypto', icon: '🔗' },
  { step: 4, label: 'Funds released', sub: 'You receive USDC directly to your wallet', icon: '💸' },
];

const features = [
  { title: 'Lightning Speed', desc: 'Settlements in ~400ms vs 5 days for traditional bank wires.', icon: '⚡', gradient: 'from-amber-400/20 to-orange-400/10' },
  { title: 'Low Cost', desc: '~4–5% total fees vs 20%+ on platforms like Upwork or Fiverr.', icon: '💰', gradient: 'from-emerald-400/20 to-teal-400/10' },
  { title: 'Global Access', desc: 'No US entity required. Connect a wallet and start getting paid.', icon: '🌍', gradient: 'from-blue-400/20 to-indigo-400/10' },
  { title: 'Embedded Wallet', desc: 'Sign in with email and get a Solana wallet. No extensions needed.', icon: '👛', gradient: 'from-purple-400/20 to-violet-400/10' },
  { title: 'Escrow Protection', desc: 'Funds held in escrow until the client releases with a password.', icon: '🔒', gradient: 'from-rose-400/20 to-pink-400/10' },
  { title: 'Card Payments', desc: 'Clients can fund with credit/debit card — no crypto needed to start.', icon: '💳', gradient: 'from-cyan-400/20 to-sky-400/10' },
];

export default function Home() {
  const { authenticated, ready } = usePrivy();
  const walletAddress = useSolanaAddress();
  const isAuthenticated = authenticated && ready;
  const router = useRouter();

  // If authenticated, offer quick action banner (don't auto-redirect to preserve landing page)
  // But track that we could show the wallet info

  return (
    <main className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {!process.env.NEXT_PUBLIC_PRIVY_APP_ID && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-center text-sm text-amber-800">
          Privy App ID is not configured. Add{' '}
          <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_PRIVY_APP_ID</code> to your{' '}
          <code className="bg-amber-100 px-1 rounded">.env</code> file.{' '}
          <a href="https://dashboard.privy.io/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            Get your App ID →
          </a>
        </div>
      )}

      <Navbar />

      {/* ── Hero ── */}
      <section className="relative flex-1 flex flex-col items-center justify-center px-6 py-24 md:py-32 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/3 -right-20 w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#0055FF 1px, transparent 1px), linear-gradient(90deg, #0055FF 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-4xl w-full text-center">
          {isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Link
                href="/wallet"
                className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Connected
                {walletAddress && (
                  <code className="font-mono text-xs">{walletAddress.slice(0, 4)}…{walletAddress.slice(-4)}</code>
                )}
                <span>→ My Wallet</span>
              </Link>
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className="inline-flex items-center gap-2 bg-primary/8 text-primary border border-primary/15 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Powered by Solana · Now in Beta
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-text mb-6 tracking-tight leading-[1.08]">
              The Global{' '}
              <span className="relative inline-block">
                <span className="text-primary">Financial</span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-full" />
              </span>{' '}
              Bridge
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed">
              Borderless, instant, secure payments for the global workforce.
            </p>
            <p className="text-base text-gray-400 max-w-xl mx-auto mb-12">
              Settle in ~400ms with smart contract escrow. Sign in with email to get your embedded Solana wallet.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              href="/create"
              className="group inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/25"
            >
              Create Invoice
              <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-primary hover:text-primary active:scale-[0.98] transition-all duration-150"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-100 bg-gray-50/70 py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="text-center"
            >
              <p className="text-3xl font-bold text-primary tabular-nums">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute -right-20 top-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-4">How it works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Sign in with email, get an embedded Solana wallet, create an invoice, share a pay link.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Connector line (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-gray-200 z-10" />
                )}
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/8 text-2xl mb-4">
                  {item.icon}
                </span>
                <span className="block text-xs font-bold text-primary/60 uppercase tracking-wider mb-1">
                  Step {item.step}
                </span>
                <p className="font-semibold text-text text-base">{item.label}</p>
                <p className="text-sm text-gray-500 mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative bg-gray-50/60 border-t border-gray-100 py-24 px-6">
        <div className="absolute left-0 top-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Why PivLink</p>
            <h2 className="text-3xl md:text-5xl font-bold text-text mb-4">Built for the global workforce</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Fast, low-fee, borderless payments for freelancers and clients anywhere in the world.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group p-7 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl mb-5`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-text mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 gradient-hero pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-text mb-4">Ready to get started?</h2>
          <p className="text-gray-500 text-lg mb-10">Create your first invoice in under a minute. No crypto knowledge needed.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-blue-600 active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
            >
              Create Invoice
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            {!isAuthenticated && (
              <Link href="/login" className="inline-flex items-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:border-primary hover:text-primary transition-all">
                Sign In Free
              </Link>
            )}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white text-xs font-bold">P</div>
            <span className="text-gray-400 text-sm font-medium">PivLink — Global payment infrastructure on Solana.</span>
          </div>
          <div className="flex gap-6">
            <Link href="/about" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">About</Link>
            <Link href="/contact" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">Contact</Link>
            <Link href="/create" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">Create Invoice</Link>
            {isAuthenticated && (
              <Link href="/wallet" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">My Wallet</Link>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-gray-50 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} PivLink. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
