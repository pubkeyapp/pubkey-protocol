use crate::constants::*;
use crate::errors::*;
use crate::state::*;

use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Identity {
    // The provider name
    pub provider: PubKeyIdentityProvider,
    // The provider ID (address incase of blockchain)
    pub provider_id: String,
    // Nickname given to the identity
    pub name: String,
    // Communities that have verified this identity
    pub communities: Vec<Pubkey>,
}

impl Identity {
    pub fn size(&self) -> usize {
        1 + 1 + // provider
        MAX_PROVIDER_ID_SIZE +
        MAX_PROVIDER_NAME_SIZE +
        4 + (self.communities.len() * 32)
    }

    pub fn validate(&self) -> Result<()> {
        let provider_id_len = self.provider_id.len();
        let provider_name_len = self.name.len();

        require!(
            provider_id_len <= MAX_PROVIDER_ID_SIZE,
            PubkeyProfileError::InvalidProviderID
        );

        require!(
            provider_name_len <= MAX_PROVIDER_NAME_SIZE,
            PubkeyProfileError::InvalidProviderName
        );

        Ok(())
    }
}
