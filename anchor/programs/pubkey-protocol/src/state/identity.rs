use crate::constants::*;
use crate::errors::*;

use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum PubKeyIdentityProvider {
    Discord,
    Farcaster,
    Github,
    Google,
    Solana,
    Telegram,
    X,
}

impl PubKeyIdentityProvider {
    pub fn value(&self) -> String {
        match *self {
            PubKeyIdentityProvider::Discord => String::from("Discord"),
            PubKeyIdentityProvider::Farcaster => String::from("Farcaster"),
            PubKeyIdentityProvider::Github => String::from("Github"),
            PubKeyIdentityProvider::Google => String::from("Google"),
            PubKeyIdentityProvider::Solana => String::from("Solana"),
            PubKeyIdentityProvider::Telegram => String::from("Telegram"),
            PubKeyIdentityProvider::X => String::from("X"),
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Identity {
    // The provider name
    pub provider: PubKeyIdentityProvider,
    // The provider ID (address incase of blockchain)
    pub provider_id: String,
    // Nickname given to the identity
    pub name: String,
}

impl Identity {
    pub fn size() -> usize {
        1 + 1 + // provider
        MAX_PROVIDER_ID_SIZE +
        MAX_PROVIDER_NAME_SIZE
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
