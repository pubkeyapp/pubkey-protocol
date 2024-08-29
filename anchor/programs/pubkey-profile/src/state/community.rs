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
    pub x: Option<String>,       // Optional field for X (Twitter) url
    pub discord: Option<String>, // Optional field for Discord invite url
    pub github: Option<String>,  // Optional field for GitHub url
    pub website: Option<String>, // Optional field for Website url
}

impl Community {
    pub fn size(fee_payers: &[Pubkey], providers: &[Identity]) -> usize {
        let fee_payers_size = 4 + // Vector discriminator
        (fee_payers.len() * 32); // Total fee payers pubkey length

        let providers_size = 4 + // Vector discriminator
            (providers.len() * Identity::size()); // Total providers length

        8 + // Anchor discriminator
        1 + // bump
        4 + MAX_SLUG_SIZE + // slug
        4 + MAX_NAME_SIZE + // name
        4 + MAX_URL_SIZE + // avatar_url
        32 + // authority
        1 + 32 + // pending_authority (Option<PubKey>)
        fee_payers_size + // fee_payers
        providers_size + // identities
        1 + 4 + MAX_URL_SIZE + // x (Option<String>)
        1 + 4 + MAX_URL_SIZE + // discord (Option<String>)
        1 + 4 + MAX_URL_SIZE + // github (Option<String>)
        1 + 4 + MAX_URL_SIZE // website (Option<String>)
    }

    pub fn validate(&self) -> Result<()> {
        let avatar_url_len = self.avatar_url.len();
        let providers_len = self.providers.len();
        let fee_payers_len = self.fee_payers.len();

        // Username
        require!(
            is_valid_username(&self.slug),
            PubkeyProfileError::InvalidSlug
        );

        // Name
        require!(is_valid_name(&self.name), PubkeyProfileError::InvalidName);

        // Avatar URL
        require!(
            is_valid_url(&self.avatar_url),
            PubkeyProfileError::InvalidAvatarURL
        );
        require!(
            avatar_url_len > 0 && avatar_url_len <= MAX_URL_SIZE,
            PubkeyProfileError::InvalidAvatarURL
        );

        // Fee Payers
        require!(
            fee_payers_len <= MAX_VECTOR_SIZE.into(),
            PubkeyProfileError::MaxSizeReached
        );

        // Providers
        require!(
            providers_len <= MAX_VECTOR_SIZE.into(),
            PubkeyProfileError::MaxSizeReached
        );
        for identity in self.providers.clone() {
            identity.validate()?;
        }

        // TODO - Should restructure into a Link struct for all links with holisitic validation
        // X (Twitter) URL (Optional)
        if let Some(x) = &self.x {
            require!(is_valid_x(x), PubkeyProfileError::InvalidXURL);
        }

        // Discord URL (Optional)
        if let Some(discord) = &self.discord {
            require!(
                is_valid_discord(discord),
                PubkeyProfileError::InvalidDiscordURL
            );
        }

        // GitHub URL (Optional)
        if let Some(github) = &self.github {
            require!(
                is_valid_github(github),
                PubkeyProfileError::InvalidGitHubURL
            );
        }

        // Website URL (Optional)
        if let Some(website) = &self.website {
            require!(is_valid_url(website), PubkeyProfileError::InvalidWebsiteURL);
        }

        Ok(())
    }

    pub fn check_for_authority(&self, authority: &Pubkey) -> bool {
        &self.authority == authority
    }
}
