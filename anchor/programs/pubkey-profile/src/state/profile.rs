use crate::constants::*;
use crate::errors::*;
use crate::utils::*;

use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Identity {
    // The provider name
    pub provider: String,
    // The provider ID (address incase of blockchain)
    pub provider_id: String,
    // Nickname given to the identity
    pub name: String,
}

#[account]
pub struct Profile {
    // Bump of the PDA
    pub bump: u8,
    // Username
    pub username: String,
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
            (identities.len() // Total identities length
                * (MAX_PROVIDER_SIZE + MAX_PROVIDER_ID_SIZE + MAX_PROVIDER_NAME_SIZE));

        8 + // Anchor discriminator
        1 + // bump
        MAX_USERNAME_SIZE + // username
        MAX_AVATAR_URL_SIZE + // avatar_url
        authorities_size + // authorities
        identities_size // identities
    }

    pub fn validate(&self) -> Result<()> {
        let username_len = self.username.len();
        let avatar_url_len = self.avatar_url.len();

        // Username
        require!(
            username_len >= 3 && username_len <= MAX_USERNAME_SIZE,
            PubkeyProfileError::InvalidUsername
        );

        // Avatar URL
        require!(
            is_valid_url(&self.avatar_url),
            PubkeyProfileError::InvalidAvatarURL
        );

        require!(
            avatar_url_len > 0 && avatar_url_len <= MAX_AVATAR_URL_SIZE,
            PubkeyProfileError::InvalidAvatarURL
        );

        Ok(())
    }
}
