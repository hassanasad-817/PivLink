'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaAddress } from '@/lib/privy';

function HomeWithPrivy() {
  const { authenticated, ready, user, login, logout } = usePrivy();
  const solanaAddress = useSolanaAddress();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PivLink</h1>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <>
                  <span className="text-sm text-gray-600">
                    Wallet: {solanaAddress?.slice(0, 8)}...{solanaAddress?.slice(-8)}
                  </span>
                  <button
                    onClick={logout}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={login}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Global Payroll & Payments
            <span className="block text-blue-600">Made Simple</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Secure escrow payments for freelancers and businesses worldwide.
            Built on Solana for fast, low-cost transactions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Create Invoice
            </Link>
            <Link
              href="/wallet"
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              View Wallet
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Escrow</h3>
              <p className="text-gray-600">Funds are held securely until work is completed and approved.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Built on Solana for instant transactions and low fees.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Payments</h3>
              <p className="text-gray-600">Accept payments from anywhere in the world instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      {authenticated && ready && (
        <section className="bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold text-green-800">Wallet Connected</p>
                  <p className="text-sm text-green-700">Ready to create invoices and manage payments</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default function Home() {
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <main className="min-h-screen bg-white p-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block rounded-lg border border-amber-200 bg-amber-50 p-4 mb-6">
            <p className="font-semibold text-amber-800">Privy not configured</p>
            <p className="text-sm text-amber-700">Add NEXT_PUBLIC_PRIVY_APP_ID to app/.env.local and restart the dev server.</p>
          </div>
          <h1 className="text-3xl font-bold mb-3">PivLink</h1>
          <p className="mb-4">Your app is ready. Configure Privy to use auth and wallet features.</p>
          <a className="text-blue-600 underline" href="https://dashboard.privy.io/" target="_blank" rel="noreferrer">Get Privy App ID</a>
        </div>
      </main>
    );
  }

  return <HomeWithPrivy />;
}
