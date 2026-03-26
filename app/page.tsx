'use client';

import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaAddress } from '@/lib/privy';

function HomeWithPrivy() {
  const { authenticated, ready } = usePrivy();
  const solanaAddress = useSolanaAddress();

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">PivLink</h1>
        <p className="mb-4">Your global payroll and payments sandbox is ready.</p>
        {authenticated && ready ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 mb-4">
            <p className="font-semibold">Authenticated</p>
            <p>Wallet: {solanaAddress ?? 'Unknown (not connected yet)'}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 mb-4">
            <p>Not authenticated yet. Sign in from the app pages.</p>
          </div>
        )}
        <div className="flex gap-3">
          <Link className="rounded-lg bg-blue-600 text-white px-3 py-2" href="/login">Login</Link>
          <Link className="rounded-lg border border-slate-300 px-3 py-2" href="/create">Create Invoice</Link>
        </div>
      </div>
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
