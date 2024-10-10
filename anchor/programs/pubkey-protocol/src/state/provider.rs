use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum PubKeyIdentityProvider {
    Discord,
    Farcaster,
    Github,
    Google,
    Solana,
    Telegram,
    X,
    Website,
}

impl PubKeyIdentityProvider {
    pub fn value(&self) -> String {
        match self {
            PubKeyIdentityProvider::Discord => String::from("Discord"),
            PubKeyIdentityProvider::Farcaster => String::from("Farcaster"),
            PubKeyIdentityProvider::Github => String::from("Github"),
            PubKeyIdentityProvider::Google => String::from("Google"),
            PubKeyIdentityProvider::Solana => String::from("Solana"),
            PubKeyIdentityProvider::Telegram => String::from("Telegram"),
            PubKeyIdentityProvider::X => String::from("X"),
            PubKeyIdentityProvider::Website => String::from("Website"),
        }
    }
}