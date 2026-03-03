import { NextResponse } from 'next/server';
import { createActionHeaders } from '@solana/actions';
import type { ActionsJson } from '@solana/actions';

const headers = createActionHeaders();

/**
 * Discovery endpoint for Solana Actions/Blinks.
 * Must be at the root: https://your-domain.com/actions.json
 */
export async function GET() {
  const payload: ActionsJson = {
    rules: [
      {
        pathPattern: '/api/actions/invoice/*',
        apiPath: '/api/actions/invoice',
      },
    ],
  };

  return NextResponse.json(payload, { headers });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
