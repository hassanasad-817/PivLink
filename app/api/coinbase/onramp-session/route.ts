import { NextRequest, NextResponse } from 'next/server';
import { generateJwt } from '@coinbase/cdp-sdk/auth';

const ONRAMP_HOST = 'api.developer.coinbase.com';
const ONRAMP_PATH = '/onramp/v1/token';

/**
 * POST /api/coinbase/onramp-session
 * Body: { address: string } — wallet address to receive USDC (Solana or Base)
 * Returns: { token: string } — single-use session token for Coinbase Onramp (expires in 5 min)
 * Env: COINBASE_CDP_API_KEY_ID, COINBASE_CDP_API_KEY_SECRET (from CDP Dashboard)
 */
export async function POST(request: NextRequest) {
  try {
    const apiKeyId = process.env.COINBASE_CDP_API_KEY_ID;
    const apiKeySecret = process.env.COINBASE_CDP_API_KEY_SECRET;
    if (!apiKeyId || !apiKeySecret) {
      return NextResponse.json(
        { error: 'Coinbase CDP API keys not configured' },
        { status: 503 }
      );
    }

    const { address } = await request.json();
    if (!address || typeof address !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid address' },
        { status: 400 }
      );
    }

    // JWT for Onramp API (see https://docs.cdp.coinbase.com/get-started/authentication/jwt-authentication)
    const jwt = await generateJwt({
      apiKeyId,
      apiKeySecret,
      requestMethod: 'POST',
      requestHost: ONRAMP_HOST,
      requestPath: ONRAMP_PATH,
      expiresIn: 120,
    });

    // Create session token: USDC on Solana (Privy embedded wallets are Solana)
    const res = await fetch(`https://${ONRAMP_HOST}${ONRAMP_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        addresses: [{ address, blockchains: ['solana'] }],
        assets: ['USDC'],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Coinbase onramp token error:', res.status, err);
      return NextResponse.json(
        { error: 'Failed to create funding session' },
        { status: 502 }
      );
    }

    const data = await res.json();
    const token = data.token;
    if (!token) {
      return NextResponse.json(
        { error: 'Invalid response from funding service' },
        { status: 502 }
      );
    }

    return NextResponse.json({ token });
  } catch (e: unknown) {
    console.error('Onramp session error:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server error' },
      { status: 500 }
    );
  }
}
