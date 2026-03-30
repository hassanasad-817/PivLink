import { NextRequest, NextResponse } from 'next/server';
import { Connection, Keypair } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import bs58 from 'bs58';
import { getInvoice, updateInvoiceStatus } from '@/lib/api/invoices';
import { getEscrowPDA, getVaultPDA, uuidToBytes, getProgramId } from '@/lib/solana/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id;
    const invoice = await getInvoice(invoiceId);

    if (invoice.status !== 'created') {
      return NextResponse.json({ 
        status: invoice.status,
        message: 'Invoice already processed'
      });
    }

    // Derive vault & escrow PDAs
    const invoiceBytes = uuidToBytes(invoiceId);
    const programId = getProgramId();
    const [vaultPDA] = await getVaultPDA(invoiceBytes, programId);
    const [escrowPDA] = await getEscrowPDA(invoiceBytes, programId);

    // Check vault balance
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
      'confirmed'
    );

    // Get token account balance using Connection method
    const balance = await connection.getTokenAccountBalance(vaultPDA);

    // Convert amount to lamports (USDC has 6 decimals)
    const expectedAmount = BigInt(Math.floor(invoice.amount_usdc * 1_000_000));

    if (balance.value.amount >= expectedAmount.toString()) {
      // When funds are present, call the on-chain deposit_notification
      const hotWalletPrivateKey = process.env.HOT_WALLET_PRIVATE_KEY;
      if (!hotWalletPrivateKey) {
        throw new Error('HOT_WALLET_PRIVATE_KEY is not configured for deposit notification');
      }

      const hotWallet = Keypair.fromSecretKey(bs58.decode(hotWalletPrivateKey));
      
      // Create a simple wallet object for Anchor provider
      const wallet = {
        publicKey: hotWallet.publicKey,
        signTransaction: async (tx: any) => {
          tx.sign(hotWallet);
          return tx;
        },
        signAllTransactions: async (txs: any[]) => {
          txs.forEach(tx => tx.sign(hotWallet));
          return txs;
        },
      };
      
      const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
      });
      const idl = await anchor.Program.fetchIdl(programId, provider);
      if (!idl) {
        throw new Error('PivLink program IDL not found on-chain. Run anchor idl init/upgrade.');
      }
      const program = new anchor.Program(idl, provider);

      const tx = await program.methods
        .depositNotification()
        .accounts({
          escrow: escrowPDA,
          vault: vaultPDA,
        })
        .rpc();

      // Update status to funded only after on-chain success
      await updateInvoiceStatus(invoiceId, 'funded');

      return NextResponse.json({
        status: 'funded',
        balance: balance.value.uiAmount,
        message: 'Invoice is now funded',
        transaction: tx,
      });
    }

    return NextResponse.json({
      status: 'created',
      balance: balance.value.uiAmount,
      message: 'Invoice not yet funded',
    });
  } catch (error: any) {
    console.error('Error checking funding status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check funding status' },
      { status: 500 }
    );
  }
}
