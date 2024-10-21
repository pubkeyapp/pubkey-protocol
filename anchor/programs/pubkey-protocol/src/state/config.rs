use anchor_lang::prelude::*;

#[account]
pub struct Config {
    // Bump of the PDA
    pub bump: u8,
    // Community Authority
    pub community_authority: Pubkey,
    // Config Authority
    // FIXME: We need logic to update the community authority. Only the config authority can do this.
    pub config_authority: Pubkey,
}
impl Config {
    pub fn size() -> usize {
        8 + // Anchor discriminator
        1 + // bump
        32 + // community_authority
        32 // config_authority
    }

    pub fn validate(&self) -> Result<()> {
        Ok(())
    }

    pub fn check_for_community_authority(&self, authority: &Pubkey) -> bool {
        msg!(
            "Checking if community_authority {} = {}",
            self.community_authority.to_string(),
            authority.to_string()
        );
        &self.community_authority == authority
    }

    pub fn check_for_config_authority(&self, authority: &Pubkey) -> bool {
        msg!(
            "Checking if config_authority {} = {}",
            self.config_authority.to_string(),
            authority.to_string()
        );
        &self.config_authority == authority
    }
}
