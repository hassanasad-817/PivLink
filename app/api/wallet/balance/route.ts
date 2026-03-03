import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { getUsdcMint } from '@/lib/solana/utils';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');
    if (!address) {
      return NextResponse.json(
        { error: 'Missing address query parameter' },
        { status: 400 }
      );
    }

    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );

    const owner = new PublicKey(address);

    // SOL balance
    const solLamports = await connection.getBalance(owner);
    const sol = solLamports / 1e9;

    // USDC balance (ATA); if mint not set or ATA missing, return 0
    let usdc = 0;
    try {
      const usdcMint = getUsdcMint();
      const ata = await getAssociatedTokenAddress(usdcMint, owner);
      const balance = await connection.getTokenAccountBalance(ata);
      usdc = balance.value.uiAmount ?? 0;
    } catch {
      // No USDC mint config or no token account
    }

    return NextResponse.json({
      sol,
      usdc,
      address,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch balance';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
