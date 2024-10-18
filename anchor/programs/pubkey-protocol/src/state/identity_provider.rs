use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum IdentityProvider {
    Discord,
    Farcaster,
    Github,
    Google,
    Solana,
    Telegram,
    X,
}

impl IdentityProvider {
    pub fn value(&self) -> String {
        match self {
            IdentityProvider::Discord => String::from("Discord"),
            IdentityProvider::Farcaster => String::from("Farcaster"),
            IdentityProvider::Github => String::from("Github"),
            IdentityProvider::Google => String::from("Google"),
            IdentityProvider::Solana => String::from("Solana"),
            IdentityProvider::Telegram => String::from("Telegram"),
            IdentityProvider::X => String::from("X"),
        }
    }
}
