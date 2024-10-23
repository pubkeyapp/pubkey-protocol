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
    // Bio
    pub bio: String,
    // Avatar URL
    pub avatar_url: String,
    // Authorities that have been delegated to
    pub authorities: Vec<Pubkey>,
    // Identities user have added onto
    pub identities: Vec<Identity>,
}

impl Profile {
    pub fn size(authorities: &[Pubkey], identities: &[Identity]) -> usize {
        let authorities_size = 4 + // Vector discriminator
        (authorities.len() * 32); // Total authorities pubkey length

        let identities_size = 4 + // Vector discriminator
        identities.iter().map(|identity| Identity::size(identity)).sum::<usize>();

        8 + // Anchor discriminator
        1 + // bump
        4 + MAX_USERNAME_SIZE +
        4 + MAX_NAME_SIZE +
        4 + MAX_BIO_SIZE +
        4 + MAX_URL_SIZE +
        32 + // fee_payer
        authorities_size +
        identities_size
    }

    pub fn validate(&self) -> Result<()> {
        // Username
        require!(
            is_valid_username(&self.username),
            ProtocolError::InvalidUsername
        );

        // Name
        require!(is_valid_name(&self.name), ProtocolError::InvalidName);

        // Bio
        require!(is_valid_bio(&self.name), ProtocolError::InvalidBio);

        // Avatar URL
        require!(
            is_valid_url(&self.avatar_url),
            ProtocolError::InvalidAvatarURL
        );

        // Authorities
        require!(
            is_valid_authorities(&self.authorities),
            ProtocolError::MaxSizeReached
        );

        // Identities
        require!(
            is_valid_identities(&self.identities),
            ProtocolError::MaxSizeReached
        );

        Ok(())
    }

    pub fn check_for_authority(&self, authority: &Pubkey) -> bool {
        self.authorities.binary_search(authority).is_ok()
    }
}
