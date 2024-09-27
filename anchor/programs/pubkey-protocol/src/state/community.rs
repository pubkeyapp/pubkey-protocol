use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

use anchor_lang::prelude::*;

#[account]
pub struct Community {
    // Bump of the PDA
    pub bump: u8,
    // Slug - lowercase, (a-z), system friendly like Profile username
    pub slug: String,
    // Name
    pub name: String,
    // Avatar URL
    pub avatar_url: String,
    // Fee payers, can be multiple
    pub fee_payers: Vec<Pubkey>,
    // Authority that have been delegated to
    pub authority: Pubkey,
    // Pending authority that must sign to complete
    pub pending_authority: Option<Pubkey>,
    // Providers (identities) user have added onto
    pub providers: Vec<Identity>,
    pub discord: Option<String>,
    pub farcaster: Option<String>,
    pub github: Option<String>,
    pub telegram: Option<String>,
    pub website: Option<String>,
    pub x: Option<String>,
}

impl Community {
    pub fn size(fee_payers: &[Pubkey], providers: &[Identity]) -> usize {
        let fee_payers_size = 4 + (fee_payers.len() * 32);
        let providers_size = 4 + (providers.len() * Identity::size());
    
        8 + // Anchor discriminator
        1 + // bump
        4 + MAX_SLUG_SIZE +
        4 + MAX_NAME_SIZE +
        4 + MAX_URL_SIZE +
        32 + // authority
        1 + 32 + // pending_authority (Option<Pubkey>)
        fee_payers_size +
        providers_size +
        (1 + 4 + MAX_URL_SIZE) * 6 // 6 Social Option<String> fields
    }

    pub fn validate(&self) -> Result<()> {
        let avatar_url_len = self.avatar_url.len();
        let providers_len = self.providers.len();
        let fee_payers_len = self.fee_payers.len();

        require!(
            is_valid_username(&self.slug),
            PubkeyProfileError::InvalidSlug
        );

        require!(is_valid_name(&self.name), PubkeyProfileError::InvalidName);

        require!(
            is_valid_url(&self.avatar_url),
            PubkeyProfileError::InvalidAvatarURL
        );

        require!(
            avatar_url_len > 0 && avatar_url_len <= MAX_URL_SIZE,
            PubkeyProfileError::InvalidAvatarURL
        );

        require!(
            fee_payers_len <= MAX_VECTOR_SIZE.into(),
            PubkeyProfileError::MaxSizeReached
        );

        require!(
            providers_len <= MAX_VECTOR_SIZE.into(),
            PubkeyProfileError::MaxSizeReached
        );
        for identity in self.providers.clone() {
            identity.validate()?;
        }

        // Create a Link struct and validate method
        let social_links = vec![
            Link::new("discord", self.discord.as_deref()),
            Link::new("farcaster", self.farcaster.as_deref()),
            Link::new("github", self.github.as_deref()),
            Link::new("telegram", self.telegram.as_deref()),
            Link::new("website", self.website.as_deref()),
            Link::new("x", self.x.as_deref()),
        ];

        for link in social_links {
            link.validate()?;
        }

        pub struct Link<'a> {
            link_type: &'a str,
            url: Option<&'a str>,
        }

        impl<'a> Link<'a> {
            pub fn new(link_type: &'a str, url: Option<&'a str>) -> Self {
                Self { link_type, url }
            }

            pub fn validate(&self) -> Result<()> {
                if let Some(url) = self.url {
                    match self.link_type {
                        "discord" => require!(is_valid_discord(url), PubkeyProfileError::InvalidDiscordURL),
                        "farcaster" => require!(is_valid_farcaster(url), PubkeyProfileError::InvalidFarcasterURL),
                        "github" => require!(is_valid_github(url), PubkeyProfileError::InvalidGitHubURL),
                        "telegram" => require!(is_valid_telegram(url), PubkeyProfileError::InvalidTelegramURL),
                        "website" => require!(is_valid_url(url), PubkeyProfileError::InvalidWebsiteURL),
                        "x" => require!(is_valid_x(url), PubkeyProfileError::InvalidXURL),
                        _ => return Err(PubkeyProfileError::InvalidProviderID.into()),
                    }
                }
                Ok(())
            }
        }

        Ok(())
    }

    pub fn check_for_authority(&self, authority: &Pubkey) -> bool {
        &self.authority == authority
    }
}
