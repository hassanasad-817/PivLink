'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';

const perks = [
  { title: 'Speed', desc: 'Settlements in ~400ms. No waiting for bank transfers or payout queues.', icon: '⚡' },
  { title: 'Cost', desc: 'Lower fees than traditional platforms. Keep more of what you earn.', icon: '💰' },
  { title: 'Access', desc: 'No US entity or complex KYC required. Connect a wallet and go.', icon: '🌍' },
  { title: 'Security', desc: 'Escrow on Solana. Only the release password can move funds to you.', icon: '🔒' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-white to-gray-50 py-24 px-6">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,85,255,0.1), transparent)',
        }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-4">Our Story</p>
            <h1 className="text-5xl md:text-6xl font-bold text-text mb-5 tracking-tight">About PivLink</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              The global financial bridge for borderless, instant payments powering the modern workforce.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="bg-gray-50 rounded-3xl p-10 mb-12">
            <h2 className="text-2xl font-bold text-text mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              PivLink connects freelancers and clients worldwide with fast, low-cost payments built on Solana.
              We use smart contract escrow so funds are secure until work is delivered, and settlements happen
              in seconds — not days. No borders, no banks, no bureaucracy.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-text mb-6">How It Works</h2>
          <div className="space-y-4">
            {[
              { n: 1, title: 'Create an invoice', desc: 'Set amount, client details, and a release password. Takes under 60 seconds.' },
              { n: 2, title: 'Client pays', desc: 'Funds are locked in an on-chain escrow (USDC on Solana). Client can pay with card.' },
              { n: 3, title: 'Deliver work', desc: 'Do your work and share the release link and password with your client.' },
              { n: 4, title: 'Release funds', desc: 'Client confirms and funds are sent to your Solana wallet in ~400ms.' },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-5 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-text">{s.title}</p>
                  <p className="text-gray-500 text-sm mt-1">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-text mb-6">Why PivLink</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {perks.map((p) => (
              <div key={p.title} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <span className="text-2xl mb-3 block">{p.icon}</span>
                <h3 className="font-bold text-text mb-1">{p.title}</h3>
                <p className="text-gray-500 text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mt-16 text-center">
          <Link href="/" className="btn-primary inline-block">
            Get Started →
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-6 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-gray-400 text-sm">© {new Date().getFullYear()} PivLink</span>
          <div className="flex gap-6">
            <Link href="/contact" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">Contact</Link>
            <Link href="/create" className="text-gray-400 hover:text-primary text-sm font-medium transition-colors">Create Invoice</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
