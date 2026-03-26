import { useWallets, usePrivy } from '@privy-io/react-auth';
import { useWallets as useSolanaWallets } from '@privy-io/react-auth/solana';

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

/**
 * Get the user's Solana wallet address from Privy.
 * Uses Solana-specific useWallets first (returns ConnectedStandardSolanaWallet with .address), then falls back to main useWallets.
 */
export function useSolanaAddress(): string | null {
  if (!privyAppId) return null;

  const solanaWalletsData = useSolanaWallets();
  const mainWalletsData = useWallets();
  const solanaWallets = solanaWalletsData?.wallets ?? [];
  const solanaReady = solanaWalletsData?.ready ?? false;
  const mainWallets = mainWalletsData?.wallets ?? [];

  if (solanaReady && solanaWallets.length > 0) return solanaWallets[0].address;

  const solanaFromMain = mainWallets.find((w: { type?: string; chainId?: string; walletClientType?: string }) => {
    if ((w as { type?: string }).type === 'solana') return true;
    const wt = w.walletClientType ?? '';
    if (wt !== 'privy' && wt !== 'privy-v2') return false;
    const chain = (w.chainId ?? '').toLowerCase();
    return chain.startsWith('solana:');
  });
  return (solanaFromMain as { address?: string })?.address ?? null;
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  if (!privyAppId) return false;
  const { authenticated } = usePrivy();
  return authenticated;
}
