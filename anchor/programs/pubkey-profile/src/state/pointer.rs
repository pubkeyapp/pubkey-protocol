use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;

#[account]
pub struct Pointer {
    // Bump for this address
    pub bump: u8,
    // Provider Name for Identity
    pub provider_name: String,
    // Provider ID for Identity
    pub provider_id: String,
    // Profile that the identity is pointing towards
    pub profile: Pubkey,
}

impl Pointer {
    pub fn size() -> usize {
        8 + // Anchor Disciminator
        MAX_PROVIDER_NAME_SIZE + // provider_name
        MAX_PROVIDER_ID_SIZE + // provider_id
        32 // profile
    }

    pub fn validate(&self) -> Result<()> {
        let provider_name_len = self.provider_name.len();
        let provider_id_len = self.provider_id.len();

        require!(
            provider_id_len <= MAX_PROVIDER_ID_SIZE,
            PubkeyProfileError::InvalidProviderID
        );

        require!(
            provider_name_len <= MAX_PROVIDER_NAME_SIZE,
            PubkeyProfileError::InvalidName
        );

        Ok(())
    }
}
