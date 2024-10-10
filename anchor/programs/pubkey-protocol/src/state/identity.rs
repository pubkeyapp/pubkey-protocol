use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ProviderID {
    String(String),
    PubKey(Pubkey),
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Identity {
    // The provider name
    pub provider: PubKeyIdentityProvider,
    // The provider ID (address incase of blockchain)
    pub provider_id: ProviderID,
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
        let provider_id_len = match &self.provider_id {
            ProviderID::String(s) => s.len(),
            ProviderID::PubKey(_) => 32,
        };
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
                if let ProviderID::PubKey(pubkey) = &self.provider_id {
                    require!(
                        is_valid_pubkey(pubkey),
                        PubkeyProfileError::InvalidSolanaPubKey
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidSolanaPubKey.into());
                }
            },
            PubKeyIdentityProvider::Discord => {
                if let ProviderID::String(id) = &self.provider_id {
                    require!(
                        is_valid_provider(id, &self.provider.value()),
                        PubkeyProfileError::InvalidDiscordURL
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidDiscordURL.into());
                }
            },
            PubKeyIdentityProvider::Farcaster => {
                if let ProviderID::String(id) = &self.provider_id {
                    require!(
                        is_valid_provider(id, &self.provider.value()),
                        PubkeyProfileError::InvalidFarcasterURL
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidFarcasterURL.into());
                }
            },
            PubKeyIdentityProvider::Github => {
                if let ProviderID::String(id) = &self.provider_id {
                    require!(
                        is_valid_provider(id, &self.provider.value()),
                        PubkeyProfileError::InvalidGitHubURL
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidGitHubURL.into());
                }
            },
            PubKeyIdentityProvider::Google => {
                if let ProviderID::String(id) = &self.provider_id {
                    require!(
                        is_valid_provider(id, &self.provider.value()),
                        PubkeyProfileError::InvalidGoogleURL
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidGoogleURL.into());
                }
            },
            PubKeyIdentityProvider::Telegram => {
                if let ProviderID::String(id) = &self.provider_id {
                    require!(
                        is_valid_provider(id, &self.provider.value()),
                        PubkeyProfileError::InvalidTelegramURL
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidTelegramURL.into());
                }
            },
            PubKeyIdentityProvider::Website => {
                if let ProviderID::String(_id) = &self.provider_id {
                    require!(
                        is_valid_url(&self.provider.value()),
                        PubkeyProfileError::InvalidWebsiteURL
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidWebsiteURL.into());
                }
            },
            PubKeyIdentityProvider::X => {
                if let ProviderID::String(id) = &self.provider_id {
                    require!(
                        is_valid_provider(id, &self.provider.value()),
                        PubkeyProfileError::InvalidXURL
                    );
                } else {
                    return Err(PubkeyProfileError::InvalidXURL.into());
                }
            },
        }

        Ok(())
    }
}
