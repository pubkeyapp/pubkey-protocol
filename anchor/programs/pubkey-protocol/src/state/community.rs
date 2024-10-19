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
    // Signers, can be multiple
    pub signers: Vec<Pubkey>,
    // Authority that have been delegated to
    pub authority: Pubkey,
    // Pending authority that must sign to complete
    pub pending_authority: Option<Pubkey>,
    // Providers (identities) user have added onto
    pub providers: Vec<IdentityProvider>,
    // Links to the community
    pub discord: Option<String>,
    pub farcaster: Option<String>,
    pub github: Option<String>,
    pub telegram: Option<String>,
    pub website: Option<String>,
    pub x: Option<String>,
}

impl Community {
    pub fn size(signers: &[Pubkey], providers: &[IdentityProvider]) -> usize {
        let signers_size = 4 + (signers.len() * 32);
        let providers_size = 4 + (providers.len() * std::mem::size_of::<IdentityProvider>());
        let links_count = 6;
        let links_size = (1 + 4 + MAX_URL_SIZE) * links_count;

        8 + // Anchor discriminator
        1 + // bump
        4 + MAX_SLUG_SIZE +
        4 + MAX_NAME_SIZE +
        4 + MAX_URL_SIZE +
        32 + // authority
        1 + 32 + // pending_authority (Option<Pubkey>)
        signers_size +
        providers_size +
        links_size
    }

    pub fn validate(&self) -> Result<()> {
        let avatar_url_len = self.avatar_url.len();
        let providers_len = self.providers.len();
        let signers_len = self.signers.len();

        require!(is_valid_username(&self.slug), ProtocolError::InvalidSlug);

        require!(is_valid_name(&self.name), ProtocolError::InvalidName);

        require!(
            is_valid_url(&self.avatar_url),
            ProtocolError::InvalidAvatarURL
        );

        require!(
            avatar_url_len > 0 && avatar_url_len <= MAX_URL_SIZE,
            ProtocolError::InvalidAvatarURL
        );

        require!(
            signers_len <= MAX_VECTOR_SIZE.into(),
            ProtocolError::MaxSizeReached
        );

        require!(
            providers_len <= MAX_VECTOR_SIZE.into(),
            ProtocolError::MaxSizeReached
        );

        Ok(())
    }

    pub fn check_for_authority(&self, authority: &Pubkey) -> bool {
        &self.authority == authority
    }
}
