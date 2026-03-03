use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowError {
    #[msg("Invalid escrow state")]
    InvalidState,

    #[msg("Vault does not contain required funds")]
    InsufficientFunds,

    #[msg("Invalid USDC mint address")]
    InvalidMint,
}
