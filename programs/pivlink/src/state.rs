use anchor_lang::prelude::*;

#[account]
pub struct Escrow {
    pub invoice_id: [u8; 16],
    pub freelancer: Pubkey,
    pub amount: u64,
    pub state: EscrowState,
    pub bump: u8,
}

impl Escrow {
    pub const LEN: usize =
        16 + // invoice_id
        32 + // freelancer
        8 +  // amount
        1 +  // state
        1;   // bump
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowState {
    AwaitingFunds,
    Funded,
    Released,
}
