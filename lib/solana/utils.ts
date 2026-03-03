import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';

/**
 * Derive the Escrow PDA address for an invoice
 * Seeds: ["pivlink", invoice_id]
 */
export async function getEscrowPDA(
  invoiceId: Uint8Array,
  programId: PublicKey
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from('pivlink'),
      Buffer.from(invoiceId),
    ],
    programId
  );
}

/**
 * Derive the Vault Token Account PDA address for an invoice
 * Seeds: ["vault", invoice_id]
 */
export async function getVaultPDA(
  invoiceId: Uint8Array,
  programId: PublicKey
): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddress(
    [
      Buffer.from('vault'),
      Buffer.from(invoiceId),
    ],
    programId
  );
}

/**
 * Convert UUID string to bytes array
 */
export function uuidToBytes(uuid: string): Uint8Array {
  const hex = uuid.replace(/-/g, '');
  const bytes = new Uint8Array(16);
  for (let i = 0; i < 32; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

/** Returns true if the string is a valid Solana public key (base58). */
export function isValidSolanaPublicKey(value: string): boolean {
  if (!value || value.length < 32 || value.length > 44) return false;
  if (/REPLACE|your_/i.test(value)) return false;
  try {
    new PublicKey(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get program ID from environment
 */
export function getProgramId(): PublicKey {
  const programId = process.env.NEXT_PUBLIC_PROGRAM_ID;
  if (!programId || !isValidSolanaPublicKey(programId)) {
    throw new Error(
      'NEXT_PUBLIC_PROGRAM_ID is not set or invalid. Deploy your Anchor program and set it in .env (e.g. from anchor keys list).'
    );
  }
  return new PublicKey(programId);
}

/**
 * Get USDC mint address from environment
 */
export function getUsdcMint(): PublicKey {
  const mint = process.env.NEXT_PUBLIC_USDC_MINT;
  if (!mint) {
    throw new Error('NEXT_PUBLIC_USDC_MINT is not set');
  }
  return new PublicKey(mint);
}

/**
 * Get treasury wallet address from environment
 */
export function getTreasuryWallet(): PublicKey {
  const treasury = process.env.NEXT_PUBLIC_TREASURY_WALLET;
  if (!treasury) {
    throw new Error('NEXT_PUBLIC_TREASURY_WALLET is not set');
  }
  return new PublicKey(treasury);
}
