'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePrivy } from '@privy-io/react-auth';
import { useSolanaAddress } from '@/lib/privy';

function shortAddress(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function HomeWithPrivy() {
  const { authenticated, ready } = usePrivy();
  const solanaAddress = useSolanaAddress();

  return (
    <HomeMarketing
      authenticated={authenticated && ready}
      solanaAddress={solanaAddress}
      privyConfigured
    />
  );
}

function HomeMarketing({
  authenticated,
  solanaAddress,
  privyConfigured,
}: {
  authenticated: boolean;
  solanaAddress: string | null;
  privyConfigured: boolean;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const programId = process.env.NEXT_PUBLIC_PROGRAM_ID;
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;

  return (
    <main className="min-h-screen bg-white">
      {!privyConfigured && (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-amber-900">
            <span className="font-semibold">Action required:</span> set{' '}
            <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_PRIVY_APP_ID</code> in your env
            and redeploy.{' '}
            <a
              className="underline font-medium"
              href="https://dashboard.privy.io/"
              target="_blank"
              rel="noreferrer"
            >
              Get Privy App ID
            </a>
          </div>
        </div>
      )}

      <header className="border-b border-slate-200/70">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              P
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">PivLink</div>
              <div className="text-xs text-slate-500">Escrow-powered USDC payments</div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <Link className="text-sm text-slate-600 hover:text-slate-900" href="/create">
              Create invoice
            </Link>
            <Link
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              href="/login"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_10%,rgba(37,99,235,0.12),transparent_55%),radial-gradient(900px_circle_at_80%_30%,rgba(14,165,233,0.10),transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Non-custodial escrow on Solana
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                Get paid in USDC with escrow that clients can trust.
              </h1>
              <p className="mt-4 text-lg text-slate-600">
                Create an invoice, share a pay link, and release funds only when work is approved.
                Simple UX for clients. Wallet-ready for freelancers.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  href="/create"
                >
                  Create an invoice
                </Link>
                <Link
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  href="/about"
                >
                  How it works
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="font-semibold text-slate-900">USDC</div>
                  <div className="mt-1 text-slate-600">Stable pricing</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="font-semibold text-slate-900">Escrow</div>
                  <div className="mt-1 text-slate-600">On-chain rules</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                  <div className="font-semibold text-slate-900">Fast</div>
                  <div className="mt-1 text-slate-600">Solana finality</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.1 } }}
              className="rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">Status</div>
                <div className="text-xs text-slate-500">Live</div>
              </div>
              <div className="p-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">Auth</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {authenticated ? 'Signed in' : 'Not signed in'}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">Wallet</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {solanaAddress ? shortAddress(solanaAddress) : 'Not connected yet'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500">Program</div>
                    <div className="mt-1 font-mono text-xs text-slate-800 break-all">
                      {programId ?? '—'}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-xs text-slate-500">RPC</div>
                    <div className="mt-1 font-mono text-xs text-slate-800 break-all">
                      {rpcUrl ?? '—'}
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="text-xs text-slate-500">App URL</div>
                  <div className="mt-1 font-mono text-xs text-slate-800 break-all">
                    {appUrl ?? '—'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Designed for trust</h2>
            <p className="mt-2 text-slate-600">
              Your clients get a clean pay experience. You get escrow enforced by a smart contract.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">Escrow rules on-chain</div>
            <p className="mt-2 text-sm text-slate-600">
              Funds are held in a program-owned vault PDA and released only by the client&apos;s
              authorization.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm font-semibold text-slate-900">USDC settlement</div>
            <p className="mt-2 text-sm text-slate-600">
              Quote and settle in stablecoins to avoid volatility and improve transparency for both
              sides.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              title: '1) Create invoice',
              body: 'Set amount, deadline, and escrow details.',
            },
            {
              title: '2) Client pays',
              body: 'Client funds the escrow vault via the pay link.',
            },
            {
              title: '3) Release',
              body: 'Client approves delivery and releases funds to the freelancer.',
            },
          ].map((s) => (
            <div key={s.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <div className="font-semibold text-slate-900">{s.title}</div>
              <div className="mt-2 text-sm text-slate-600">{s.body}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200/70">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-semibold text-slate-900">PivLink</span> — escrow-powered payments
            for global work.
          </div>
          <div className="flex gap-4 text-sm">
            <Link className="text-slate-600 hover:text-slate-900" href="/create">
              Create
            </Link>
            <Link className="text-slate-600 hover:text-slate-900" href="/login">
              Login
            </Link>
            <a
              className="text-slate-600 hover:text-slate-900"
              href="https://solana.com/"
              target="_blank"
              rel="noreferrer"
            >
              Solana
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return <HomeMarketing authenticated={false} solanaAddress={null} privyConfigured={false} />;
  }

  return <HomeWithPrivy />;
}
