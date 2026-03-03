import { getSupabase } from '@/lib/supabase/client';
import type { Invoice } from '@/lib/supabase/types';
import bcrypt from 'bcryptjs';

export interface CreateInvoiceParams {
  freelancerWallet: string;
  clientName?: string;
  amountUsdc: number;
  releasePassword: string;
}

/** Ensure the freelancer exists in users so invoice FK is satisfied. */
export async function ensureUser(walletAddress: string, name?: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('users')
    .upsert(
      {
        wallet_address: walletAddress,
        name: name || `Freelancer ${walletAddress.slice(0, 8)}`,
        role: 'freelancer',
      },
      { onConflict: 'wallet_address', ignoreDuplicates: true }
    );
  if (error) {
    throw new Error(`Failed to ensure user: ${error.message}`);
  }
}

export async function createInvoice(params: CreateInvoiceParams): Promise<Invoice> {
  await ensureUser(params.freelancerWallet);
  // Hash the release password
  const releasePasswordHash = await bcrypt.hash(params.releasePassword, 10);

  // Generate invoice ID (UUID)
  const invoiceId = crypto.randomUUID();

  // Unique vault placeholder; random suffix avoids any duplicate-key edge cases
  const vaultAddress = `off-chain-${invoiceId}-${Math.random().toString(36).slice(2, 10)}`;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('invoices')
    .insert({
      id: invoiceId,
      freelancer_wallet: params.freelancerWallet,
      client_name: params.clientName || null,
      amount_usdc: params.amountUsdc,
      vault_address: vaultAddress,
      status: 'created',
      mode: 'manual',
      release_password_hash: releasePasswordHash,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create invoice: ${error.message}`);
  }

  return data;
}

export async function getInvoice(invoiceId: string): Promise<Invoice> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch invoice: ${error.message}`);
  }

  return data;
}

/** List invoices for a freelancer wallet, optionally filtered by status. */
export async function getInvoicesByFreelancer(
  freelancerWallet: string,
  options?: { status?: Invoice['status'] }
): Promise<Invoice[]> {
  const supabase = getSupabase();
  let query = supabase
    .from('invoices')
    .select('*')
    .eq('freelancer_wallet', freelancerWallet)
    .order('updated_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Failed to fetch invoices: ${error.message}`);
  }
  return data ?? [];
}

export async function updateInvoiceVault(invoiceId: string, vaultAddress: string): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('invoices')
    .update({ vault_address: vaultAddress })
    .eq('id', invoiceId);

  if (error) {
    throw new Error(`Failed to update vault address: ${error.message}`);
  }
}

export async function updateInvoiceStatus(invoiceId: string, status: Invoice['status']): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from('invoices')
    .update({ status })
    .eq('id', invoiceId);

  if (error) {
    throw new Error(`Failed to update invoice status: ${error.message}`);
  }
}

export async function checkFundingStatus(invoiceId: string): Promise<void> {
  // This will be called by the API route that checks on-chain status
  const response = await fetch(`/api/invoices/${invoiceId}/check-funding`);
  if (!response.ok) {
    throw new Error('Failed to check funding status');
  }
}

export async function releaseFunds(invoiceId: string, password: string): Promise<void> {
  // Password verification is done server-side in the API route.
  // Do NOT compare hashes client-side — just forward to the API.
  const response = await fetch(`/api/invoices/${invoiceId}/release`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || 'Failed to release funds');
  }
}
