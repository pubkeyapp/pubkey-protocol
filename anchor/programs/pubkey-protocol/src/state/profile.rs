use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

use anchor_lang::prelude::*;

#[account]
pub struct Profile {
    // Bump of the PDA
    pub bump: u8,
    // Username
    pub username: String,
    // Name
    pub name: String,
    // Avatar URL
    pub avatar_url: String,
    // Remote fee payer
    pub fee_payer: Pubkey,
    // Authorities that have been delegated to
    pub authorities: Vec<Pubkey>,
    // Identities user have added onto
    pub identities: Vec<Identity>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug)]
pub struct CommunityVerification {
    pub community: Pubkey,
    pub verified_by: Pubkey,
}

impl Profile {
    pub fn size(authorities: &[Pubkey], identities: &[Identity]) -> usize {
        let authorities_size = 4 + // Vector discriminator
        (authorities.len() * 32); // Total authorities pubkey length

        let identities_size = 4 + // Vector discriminator
        identities.iter().map(|identity| Identity::size(identity)).sum::<usize>();

        let communities_size = 4 + (0 * std::mem::size_of::<CommunityVerification>());

        8 + // Anchor discriminator
        1 + // bump
        4 + MAX_USERNAME_SIZE +
        4 + MAX_NAME_SIZE +
        4 + MAX_URL_SIZE +
        32 + // fee_payer
        authorities_size +
        identities_size +
        communities_size
    }

    pub fn validate(&self) -> Result<()> {
        let avatar_url_len = self.avatar_url.len();
        let identities_len = self.identities.len();
        let authorities_len = self.authorities.len();

        // Username
        require!(
            is_valid_username(&self.username),
            PubkeyProfileError::InvalidUsername
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

        // Authorities
        require!(
            authorities_len <= MAX_VECTOR_SIZE.into(),
            PubkeyProfileError::MaxSizeReached
        );

        // Identities
        require!(
            identities_len <= MAX_VECTOR_SIZE.into(),
            PubkeyProfileError::MaxSizeReached
        );
        for identity in self.identities.clone() {
            identity.validate()?;
        }

        Ok(())
    }

    pub fn check_for_authority(&self, authority: &Pubkey) -> bool {
        self.authorities.binary_search(authority).is_ok()
    }
}
