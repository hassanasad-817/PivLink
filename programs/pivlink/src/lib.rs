use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer, CloseAccount, Mint};

mod state;
mod errors;

use state::*;
use errors::*;

declare_id!("REPLACE_WITH_YOUR_PROGRAM_ID");

#[program]
pub mod pivlink {
    use super::*;

    /// Initialize a new escrow vault for an invoice
    /// Called by: Freelancer
    /// Creates PDA vault and sets state to AwaitingFunds
    pub fn initialize(
        ctx: Context<Initialize>,
        invoice_id: [u8; 16],
        amount: u64,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;

        escrow.invoice_id = invoice_id;
        escrow.freelancer = ctx.accounts.freelancer.key();
        escrow.amount = amount;
        escrow.state = EscrowState::AwaitingFunds;
        escrow.bump = ctx.bumps.escrow;

        msg!("Escrow initialized for invoice: {:?}", invoice_id);
        msg!("Amount: {}", amount);
        msg!("Freelancer: {}", escrow.freelancer);

        Ok(())
    }

    /// Notify the contract that funds have been deposited
    /// Called by: Anyone (permissionless)
    /// Checks vault balance and updates state if sufficient funds
    pub fn deposit_notification(ctx: Context<DepositNotification>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;

        require!(
            escrow.state == EscrowState::AwaitingFunds,
            EscrowError::InvalidState
        );

        let vault_balance = ctx.accounts.vault.amount;
        require!(
            vault_balance >= escrow.amount,
            EscrowError::InsufficientFunds
        );

        escrow.state = EscrowState::Funded;

        msg!("Escrow funded. Balance: {}", vault_balance);

        Ok(())
    }

    /// Release funds from escrow
    /// Called by: Authorized releaser (V1: Backend hot wallet, V2: Client or AI Admin)
    /// Transfers 99% to freelancer, 1% to treasury, then closes vault
    pub fn release(ctx: Context<Release>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;

        require!(
            escrow.state == EscrowState::Funded,
            EscrowError::InvalidState
        );

        // Verify USDC mint matches
        require!(
            ctx.accounts.vault.mint == ctx.accounts.usdc_mint.key(),
            EscrowError::InvalidMint
        );

        let total_amount = escrow.amount;
        let fee = total_amount / 100; // 1%
        let payout = total_amount - fee;

        msg!("Releasing funds. Total: {}, Fee: {}, Payout: {}", total_amount, fee, payout);

        // Transfer fee to treasury
        let fee_seeds: &[&[&[u8]]] = &[&[
            b"pivlink",
            &escrow.invoice_id,
            &[ctx.bumps.escrow],
        ]];

        token::transfer(
            ctx.accounts.transfer_fee_ctx().with_signer(fee_seeds),
            fee,
        )?;

        // Transfer remainder to freelancer
        token::transfer(
            ctx.accounts.transfer_freelancer_ctx().with_signer(fee_seeds),
            payout,
        )?;

        // Close vault
        token::close_account(
            ctx.accounts.close_ctx().with_signer(fee_seeds),
        )?;

        escrow.state = EscrowState::Released;

        msg!("Funds released successfully");

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(invoice_id: [u8; 16])]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = freelancer,
        space = 8 + Escrow::LEN,
        seeds = [b"pivlink", &invoice_id],
        bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = freelancer,
        token::mint = usdc_mint,
        token::authority = escrow,
        seeds = [b"vault", &invoice_id],
        bump
    )]
    pub vault: Account<'info, TokenAccount>,

    pub usdc_mint: Account<'info, Mint>,

    #[account(mut)]
    pub freelancer: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DepositNotification<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"vault", &escrow.invoice_id],
        bump = escrow.bump
    )]
    pub vault: Account<'info, TokenAccount>,
}

#[derive(Accounts)]
pub struct Release<'info> {
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"vault", &escrow.invoice_id],
        bump = escrow.bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub freelancer_token: Account<'info, TokenAccount>,

    #[account(mut)]
    pub treasury_token: Account<'info, TokenAccount>,

    /// CHECK: USDC mint verification
    pub usdc_mint: Account<'info, Mint>,

    /// CHECK: Freelancer account (for closing vault)
    #[account(mut)]
    pub freelancer: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
}

impl<'info> Release<'info> {
    pub fn transfer_fee_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.treasury_token.to_account_info(),
            authority: self.escrow.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }

    pub fn transfer_freelancer_ctx(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.freelancer_token.to_account_info(),
            authority: self.escrow.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }

    pub fn close_ctx(&self) -> CpiContext<'_, '_, '_, 'info, CloseAccount<'info>> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = CloseAccount {
            account: self.vault.to_account_info(),
            destination: self.freelancer.to_account_info(),
            authority: self.escrow.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}
