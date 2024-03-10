use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Identity {
    pub provider: String,
    pub provider_id: String,
    pub name: String,
}

#[account]
pub struct Profile {
    // Bump of the PDA
    pub bump: u8,
    // Avatar URL
    pub avatar_url: String,
    // Authorities that have been delegated to
    pub authorities: Vec<Pubkey>,
    // Identities user have added onto
    pub identities: Vec<Identity>,
}
