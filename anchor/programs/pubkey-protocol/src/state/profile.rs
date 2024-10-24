use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

use anchor_lang::prelude::*;

#[account]
pub struct Profile {
   pub bump: u8,
    pub username: String,
    pub name: String,
    pub avatar_url: String,
    pub bio: String, 
    pub authorities: Vec<Pubkey>,
    pub identities: Vec<Identity>,
}


impl Profile {
    pub fn size(authorities: &[Pubkey], identities: &[Identity]) -> usize {
        let authorities_size = 4 + (authorities.len() * 32); 
        let identities_size = 4 + identities.iter().map(|identity| Identity::size(identity)).sum::<usize>();

        8 + // Anchor discriminator
        1 + // bump
        4 + MAX_USERNAME_SIZE +
        4 + MAX_NAME_SIZE +
        4 + MAX_URL_SIZE +
        4 + MAX_BIO_SIZE + 
        32 + 
        authorities_size +
        identities_size
    }
}


    pub fn validate(&self) -> Result<()> {
        let avatar_url_len = self.avatar_url.len();
        let identities_len = self.identities.len();
        let authorities_len = self.authorities.len();
        let bio_len = self.bio.len();  // Bio length

        // Username
        require!(
            is_valid_username(&self.username),
            ProtocolError::InvalidUsername
        );

        // Name
        require!(is_valid_name(&self.name), ProtocolError::InvalidName);

        // Avatar URL
        require!(
            is_valid_url(&self.avatar_url),
            ProtocolError::InvalidAvatarURL
        );
        require!(
            avatar_url_len > 0 && avatar_url_len <= MAX_URL_SIZE,
            ProtocolError::InvalidAvatarURL
        );

        // Bio validation
        require!(
            bio_len > 0 && bio_len <= MAX_BIO_SIZE,
            ProtocolError::InvalidBio
        );

        // Authorities
        require!(
            authorities_len <= MAX_VECTOR_SIZE.into(),
            ProtocolError::MaxSizeReached
        );

        // Identities
        require!(
            identities_len <= MAX_VECTOR_SIZE.into(),
            ProtocolError::MaxSizeReached
        );
        for identity in self.identities.clone() {
            identity.validate()?;
        }

        Ok(())
    }
}
