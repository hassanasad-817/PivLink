'use client';

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaAddress } from '@/lib/privy';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/components/Toast';

function CreateInvoiceWithPrivy() {
  const { authenticated, ready, getAccessToken } = usePrivy();
  const walletAddress = useSolanaAddress();
  const isAuthenticated = authenticated && ready;
  const authLoading = !ready;
  const router = useRouter();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    amount: '',
    releasePassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !walletAddress) {
      toast('Please sign in first.', 'error');
      return;
    }
    if (formData.releasePassword !== formData.confirmPassword) {
      toast('Release passwords do not match.', 'error');
      return;
    }
    if (formData.releasePassword.length < 6) {
      toast('Release password must be at least 6 characters.', 'warning');
      return;
    }
    if (submitting) return;

    setSubmitting(true);
    try {
      const accessToken = await getAccessToken();
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

      const response = await fetch('/api/invoices/create', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          freelancerWallet: walletAddress,
          clientName: formData.clientName.trim() || undefined,
          amountUsdc: parseFloat(formData.amount),
          releasePassword: formData.releasePassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create invoice');
      }

      const data = await response.json();
      toast('Invoice created successfully!', 'success');
      router.push(`/invoice/${data.invoice.id}`);
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast(error.message || 'Failed to create invoice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Checking authentication…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md bg-white rounded-3xl border border-gray-100 shadow-lg p-10"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3 text-text">Sign In Required</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Sign in with your email to create an invoice. Your Solana wallet will be created automatically.
            </p>
            <Link href="/login" className="btn-primary inline-block">
              Sign In to Continue
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (isAuthenticated && !walletAddress) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center max-w-md bg-white rounded-3xl border border-gray-100 shadow-lg p-10"
          >
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-3 text-text">Wallet Initializing</h1>
            <p className="text-gray-500 mb-2 leading-relaxed">
              Your Solana wallet is being created. This usually completes automatically when you sign in.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Please wait a moment and refresh. If the issue persists, try signing out and back in.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary text-sm py-2.5 px-5"
              >
                Refresh Page
              </button>
              <Link href="/" className="btn-outline text-sm py-2.5 px-5">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to home
            </Link>
            <h1 className="text-4xl font-bold text-text mb-2">Create Invoice</h1>
            <p className="text-gray-500">Fill in the details below to generate your payment link.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
          >
            {/* Freelancer info */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold shrink-0">
                {walletAddress ? walletAddress.slice(0, 2).toUpperCase() : 'W'}
              </div>
              <div>
                <p className="text-sm font-medium text-text">Your Wallet (receiving)</p>
                <code className="text-xs text-gray-400 font-mono">
                  {walletAddress ? `${walletAddress.slice(0, 8)}…${walletAddress.slice(-8)}` : '—'}
                </code>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (USDC) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="input-field pr-20"
                    placeholder="1000.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                    USDC
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="releasePassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Release Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="releasePassword"
                  required
                  minLength={6}
                  value={formData.releasePassword}
                  onChange={(e) => setFormData({ ...formData, releasePassword: e.target.value })}
                  className="input-field"
                  placeholder="Min. 6 characters"
                />
                <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your client uses this password to release funds after verifying your work.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Release Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`input-field ${formData.confirmPassword && formData.confirmPassword !== formData.releasePassword
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                      : formData.confirmPassword && formData.confirmPassword === formData.releasePassword
                        ? 'border-emerald-300 focus:border-emerald-400 focus:ring-emerald-200'
                        : ''
                    }`}
                  placeholder="Re-enter release password"
                />
                {formData.confirmPassword && formData.confirmPassword !== formData.releasePassword && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* Warning box */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">Save your release password</p>
                  <p className="text-xs text-amber-600 mt-1">You will need to share this with your client after delivering work. It cannot be recovered.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  (!!formData.confirmPassword && formData.confirmPassword !== formData.releasePassword)
                }
                className="w-full bg-primary text-white py-4 rounded-2xl font-semibold text-base hover:bg-blue-600 active:scale-[0.98] transition-all duration-150 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Creating Invoice…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Invoice
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Bottom note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            A 1% platform fee is deducted at the time of release.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CreateInvoicePage() {
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <main className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-lg w-full text-center rounded-3xl border border-amber-200 bg-amber-50 p-10">
            <h1 className="text-2xl font-bold text-amber-900 mb-2">Privy not configured</h1>
            <p className="text-sm text-amber-800 mb-6">
              Set <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_PRIVY_APP_ID</code> in your environment
              variables and redeploy.
            </p>
            <a
              className="text-blue-700 underline font-medium"
              href="https://dashboard.privy.io/"
              target="_blank"
              rel="noreferrer"
            >
              Get Privy App ID
            </a>
          </div>
        </div>
      </main>
    );
  }

  return <CreateInvoiceWithPrivy />;
}
