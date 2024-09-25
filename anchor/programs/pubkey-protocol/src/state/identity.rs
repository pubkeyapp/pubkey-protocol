use crate::constants::*;
use crate::errors::*;

use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum PubKeyIdentityProvider {
    Discord,
    Solana,
    Github,
    Google,
    X,
}

impl PubKeyIdentityProvider {
    pub fn value(&self) -> String {
        match *self {
            PubKeyIdentityProvider::Discord => String::from("Discord"),
            PubKeyIdentityProvider::Github => String::from("Github"),
            PubKeyIdentityProvider::Google => String::from("Google"),
            PubKeyIdentityProvider::Solana => String::from("Solana"),
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
        MAX_PROVIDER_ID_SIZE + // provider_id
        MAX_PROVIDER_NAME_SIZE // name
    }

    pub fn validate(&self) -> Result<()> {
        let provider_id_len = self.provider_id.len();
        let provider_name_len = self.name.len();

        // provider_id
        require!(
            provider_id_len <= MAX_PROVIDER_ID_SIZE,
            PubkeyProfileError::InvalidProviderID
        );

        // name
        require!(
            provider_name_len <= MAX_PROVIDER_NAME_SIZE,
            PubkeyProfileError::InvalidProviderName
        );

        Ok(())
    }
}
