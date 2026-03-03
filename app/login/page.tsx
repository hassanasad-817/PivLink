'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function LoginPage() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (ready && authenticated) {
      router.replace('/');
    }
  }, [ready, authenticated, router]);

  if (ready && authenticated) return null;

  const handleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      toast(err.message || 'Failed to sign in. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 py-12 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo */}
      <Link href="/" className="relative mb-8 flex items-center gap-2 group">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
          P
        </div>
        <span className="text-2xl font-bold text-text">PivLink</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your account or create a new one</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              disabled={!ready}
              className="w-full bg-primary text-white py-4 rounded-2xl font-semibold text-base hover:bg-blue-600 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              {ready ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Continue with Email
                </>
              ) : (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Loading…
                </>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
              Your wallet is created automatically
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Secure', sub: 'JWT verified', icon: '🛡️' },
              { label: 'Non-custodial', sub: 'You own keys', icon: '🔑' },
              { label: 'Instant', sub: '~400ms settle', icon: '⚡' },
            ].map((b) => (
              <div key={b.label} className="text-center bg-gray-50 rounded-xl p-3">
                <span className="text-xl block mb-1">{b.icon}</span>
                <p className="text-xs font-semibold text-text">{b.label}</p>
                <p className="text-[10px] text-gray-400">{b.sub}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to PivLink's Terms of Service.
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
