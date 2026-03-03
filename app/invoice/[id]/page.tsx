'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getInvoice } from '@/lib/api/invoices';
import type { Invoice } from '@/lib/supabase/types';
import { Navbar } from '@/components/Navbar';
import { useToast } from '@/components/Toast';

export default function InvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [payLink, setPayLink] = useState('');
  const [blinkUrl, setBlinkUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  useEffect(() => {
    if (invoice) {
      setPayLink(`${window.location.origin}/pay/${invoice.id}`);
      setBlinkUrl(`${window.location.origin}/api/actions/invoice/${invoiceId}`);
    }
  }, [invoice, invoiceId]);

  const loadInvoice = async () => {
    try {
      const data = await getInvoice(invoiceId);
      setInvoice(data);
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast(`${label} copied!`, 'success');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Loading invoice…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center bg-white rounded-3xl border border-gray-100 shadow-sm p-12 max-w-sm">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2 text-text">Invoice Not Found</h1>
            <p className="text-gray-400 text-sm mb-6">The invoice you're looking for doesn't exist or was removed.</p>
            <Link href="/" className="btn-primary text-sm py-2.5 inline-block">Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = {
    created: { label: 'Awaiting Payment', class: 'bg-gray-100 text-gray-700' },
    funded: { label: 'Funded — In Escrow', class: 'bg-amber-100 text-amber-700' },
    released: { label: 'Released — Paid', class: 'bg-emerald-100 text-emerald-700' },
    disputed: { label: 'Disputed', class: 'bg-red-100 text-red-700' },
  };

  const cfg = statusConfig[invoice.status];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Back link */}
          <Link href="/wallet" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Wallet
          </Link>

          {/* Success header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6"
          >
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-text">Invoice Created</h1>
                </div>
                <p className="text-gray-500 text-sm">Share the pay link below with your client.</p>
              </div>
              <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.class}`}>
                {cfg.label}
              </span>
            </div>

            {/* Invoice details */}
            <div className="space-y-3 bg-gray-50 rounded-2xl p-5 mb-6">
              <Row label="Invoice ID">
                <code className="text-xs font-mono text-gray-500 break-all">{invoice.id}</code>
              </Row>
              <Row label="Amount">
                <span className="text-xl font-bold text-primary">
                  {Number(invoice.amount_usdc).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDC
                </span>
              </Row>
              {invoice.client_name && <Row label="Client"><span className="font-medium text-text">{invoice.client_name}</span></Row>}
              <Row label="Vault Address">
                <code className="text-xs font-mono text-gray-400 break-all">{invoice.vault_address || 'Not initialized'}</code>
              </Row>
            </div>

            {/* Pay link */}
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Pay Link</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={payLink}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl bg-white font-mono text-xs text-gray-500 outline-none"
                />
                <button
                  onClick={() => copyToClipboard(payLink, 'Pay link')}
                  className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">Share this link with your client so they can pay with card or crypto.</p>
            </div>

            {/* Blink URL */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Solana Blink URL
                <span className="ml-2 text-xs text-gray-400 font-normal">(for wallet-native payment, no browser needed)</span>
              </h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={blinkUrl}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl bg-white font-mono text-xs text-gray-500 outline-none"
                />
                <button
                  onClick={() => copyToClipboard(blinkUrl, 'Blink URL')}
                  className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shrink-0"
                >
                  Copy
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">Works in X, Backpack, and other Blink-aware applications.</p>
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-3"
          >
            <Link
              href={payLink || '#'}
              className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-semibold text-sm hover:bg-blue-600 active:scale-[0.98] transition-all text-center shadow-md shadow-primary/20"
            >
              Open Pay Link →
            </Link>
            <Link
              href="/create"
              className="flex-1 border-2 border-gray-200 text-gray-700 py-3.5 rounded-2xl font-semibold text-sm hover:border-primary hover:text-primary transition-all text-center"
            >
              Create Another
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-gray-500 shrink-0 pt-0.5">{label}</span>
      <div className="text-right">{children}</div>
    </div>
  );
}
