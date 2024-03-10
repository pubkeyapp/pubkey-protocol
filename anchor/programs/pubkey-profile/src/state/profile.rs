use crate::constants::*;
use crate::errors::*;
use crate::utils::*;

use anchor_lang::prelude::*;

#[account]
pub struct Profile {
    // Bump of the PDA
    pub bump: u8,
    // Username
    pub username: String,
    // Avatar URL
    pub avatar_url: String,
    // Remote fee payer
    pub fee_payer: Pubkey,
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
            (identities.len() * Identity::size()); // Total identities length

        8 + // Anchor discriminator
        1 + // bump
        MAX_USERNAME_SIZE + // username
        MAX_AVATAR_URL_SIZE + // avatar_url
        32 + // fee_payer
        authorities_size + // authorities
        identities_size // identities
    }

    pub fn validate(&self) -> Result<()> {
        let username_len = self.username.len();
        let avatar_url_len = self.avatar_url.len();
        let identities_len = self.identities.len();
        let authorities_len = self.authorities.len();

        // Username
        require!(
            (3..=MAX_USERNAME_SIZE).contains(&username_len),
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

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Identity {
    // The provider name
    pub provider: String,
    // The provider ID (address incase of blockchain)
    pub provider_id: String,
    // Nickname given to the identity
    pub name: String,
}

impl Identity {
    pub fn size() -> usize {
        MAX_PROVIDER_SIZE + // provider
        MAX_PROVIDER_ID_SIZE + // provider_id
        MAX_PROVIDER_NAME_SIZE // name
    }

    pub fn validate(&self) -> Result<()> {
        let provider_len = self.provider.len();
        let provider_id_len = self.provider_id.len();
        let provider_name_len = self.name.len();

        // provider
        require!(
            provider_len <= MAX_PROVIDER_SIZE,
            PubkeyProfileError::InvalidProvider
        );

        // provider_id
        require!(
            provider_id_len <= MAX_PROVIDER_ID_SIZE,
            PubkeyProfileError::InvalidProviderID
        );

        // name
        require!(
            provider_name_len <= MAX_PROVIDER_NAME_SIZE,
            PubkeyProfileError::InvalidName
        );

        Ok(())
    }
}
