use std::str::FromStr;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

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

        // Validate provider_id based on the provider
        match &self.provider {
            PubKeyIdentityProvider::Solana => {
                require!(
                    Pubkey::from_str(&self.provider_id).is_ok(),
                    PubkeyProfileError::InvalidSolanaPubKey
                );
            }
            PubKeyIdentityProvider::Discord => {
                require!(
                    is_valid_provider(&self.provider.value(), &PubKeyIdentityProvider::Discord),
                    PubkeyProfileError::InvalidDiscordURL
                );
            }
            PubKeyIdentityProvider::Farcaster => {
                require!(
                    is_valid_provider(&self.provider.value(), &PubKeyIdentityProvider::Farcaster),
                    PubkeyProfileError::InvalidFarcasterURL
                );
            }
            PubKeyIdentityProvider::Github => {
                require!(
                    is_valid_provider(&self.provider.value(), &PubKeyIdentityProvider::Github),
                    PubkeyProfileError::InvalidGitHubURL
                );
            }
            PubKeyIdentityProvider::Google => {
                require!(
                    is_valid_provider(&self.provider.value(), &PubKeyIdentityProvider::Google),
                    PubkeyProfileError::InvalidGoogleURL
                );
            }
            PubKeyIdentityProvider::Telegram => {
                require!(
                    is_valid_provider(&self.provider.value(), &PubKeyIdentityProvider::Telegram),
                    PubkeyProfileError::InvalidTelegramURL
                );
            }
            PubKeyIdentityProvider::X => {
                require!(
                    is_valid_provider(&self.provider.value(), &PubKeyIdentityProvider::X),
                    PubkeyProfileError::InvalidXURL
                );
            }
        }

        Ok(())
    }
}
