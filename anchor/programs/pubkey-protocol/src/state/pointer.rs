use anchor_lang::{prelude::*, solana_program::hash::hash};

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[account]
pub struct Pointer {
    // Bump for this address
    pub bump: u8,
    // Provider type for Identity
    pub provider: PubKeyIdentityProvider,
    // Provider ID for Identity
    pub provider_id: String,
    // Profile that the identity is pointing towards
    pub profile: Pubkey,
}

impl Pointer {
    pub fn size() -> usize {
        8 + // Anchor Disciminator
        1 + 1 + // provider
        MAX_PROVIDER_ID_SIZE +
        32 // profile
    }

    pub fn validate(&self) -> Result<()> {
        let provider_id_len = self.provider_id.len();

        require!(
            provider_id_len <= MAX_PROVIDER_ID_SIZE,
            PubkeyProfileError::InvalidProviderID
        );

        Ok(())
    }

    pub fn hash_seed(provider: &PubKeyIdentityProvider, provider_id: &String) -> Vec<u8> {
        let serialized_data = [
            PREFIX,
            POINTER,
            &provider.value().as_bytes(),
            &provider_id.as_bytes(),
        ]
        .concat();

        let hashed_value = hash(&serialized_data).to_bytes();
        hashed_value.to_vec()
    }
}
