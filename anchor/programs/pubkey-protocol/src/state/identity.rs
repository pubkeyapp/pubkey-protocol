use std::str::FromStr;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Identity {
    // The provider name
    pub provider: IdentityProvider,
    // The provider ID
    pub provider_id: String,
    // Name given to the identity
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
            ProtocolError::InvalidProviderIDTooLong,
        );

        require!(
            provider_name_len <= MAX_PROVIDER_NAME_SIZE,
            ProtocolError::InvalidProviderNameTooLong
        );

        // Validate provider_id based on the provider
        match &self.provider {
            IdentityProvider::Solana => {
                require!(
                    Pubkey::from_str(&self.provider_id).is_ok(),
                    ProtocolError::InvalidSolanaPubKey
                );
            }
            IdentityProvider::Discord => {
                require!(
                    is_valid_provider_id(&self.provider_id, &IdentityProvider::Discord),
                    ProtocolError::InvalidDiscordID
                );
            }
            IdentityProvider::Farcaster => {
                require!(
                    is_valid_provider_id(&self.provider_id, &IdentityProvider::Farcaster),
                    ProtocolError::InvalidFarcasterID
                );
            }
            IdentityProvider::Github => {
                require!(
                    is_valid_provider_id(&self.provider_id, &IdentityProvider::Github),
                    ProtocolError::InvalidGitHubID
                );
            }
            IdentityProvider::Google => {
                require!(
                    is_valid_provider_id(&self.provider_id, &IdentityProvider::Google),
                    ProtocolError::InvalidGoogleID
                );
            }
            IdentityProvider::Telegram => {
                require!(
                    is_valid_provider_id(&self.provider_id, &IdentityProvider::Telegram),
                    ProtocolError::InvalidTelegramID
                );
            }
            IdentityProvider::X => {
                require!(
                    is_valid_provider_id(&self.provider_id, &IdentityProvider::X),
                    ProtocolError::InvalidXID
                );
            }
        }

        Ok(())
    }
}
