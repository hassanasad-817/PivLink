import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-white font-semibold text-lg mb-3">PivLink</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Secure escrow payments for the distributed workforce. Fast settlements, built on Solana, powered by modern wallet authentication.
          </p>
        </div>
        <div>
          <p className="text-white font-semibold text-sm uppercase tracking-[0.2em] mb-3">Explore</p>
          <div className="space-y-2 text-sm text-slate-400">
            <Link href="/" className="block hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="block hover:text-white transition-colors">About</Link>
            <Link href="/create" className="block hover:text-white transition-colors">Create Invoice</Link>
            <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-white font-semibold text-sm uppercase tracking-[0.2em] mb-3">Legal</p>
          <div className="space-y-2 text-sm text-slate-400">
            <span className="block">Terms of Service</span>
            <span className="block">Privacy Policy</span>
            <span className="block">Data Security</span>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PivLink. Built for global payment teams.
      </div>
    </footer>
  );
}
