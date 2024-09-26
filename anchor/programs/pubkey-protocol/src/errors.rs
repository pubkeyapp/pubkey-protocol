use anchor_lang::prelude::*;

#[error_code]
pub enum PubkeyProfileError {
    #[msg("Account unauthorized to perform this action")]
    UnAuthorized,
    #[msg("Invalid Fee payer")]
    InvalidFeePayer,
    #[msg("Invalid Username")]
    InvalidUsername,
    #[msg("Invalid Name")]
    InvalidName,
    #[msg("Invalid Slug")]
    InvalidSlug,
    #[msg("Invalid Avatar Url")]
    InvalidAvatarURL,
    #[msg("Invalid X (Twitter) URL")]
    InvalidXURL,
    #[msg("Invalid Discord URL")]
    InvalidDiscordURL,
    #[msg("Invalid Farcaster URL")]
    InvalidFarcasterURL,
    #[msg("Invalid Telegram URL")]
    InvalidTelegramURL,
    #[msg("Invalid GitHub URL")]
    InvalidGitHubURL,
    #[msg("Invalid Website URL")]
    InvalidWebsiteURL,
    #[msg("Invalid Provider ID")]
    InvalidProviderID,
    #[msg("Invalid Provider Name")]
    InvalidProviderName,
    #[msg("Account not owned by program")]
    InvalidAccountOwner,
    #[msg("Authority already exists")]
    AuthorityAlreadyExists,
    #[msg("Authority does not exist")]
    AuthorityNonExistent,
    #[msg("Cannot remove last remaining authority")]
    CannotRemoveSoloAuthority,
    #[msg("Array reached max size")]
    MaxSizeReached,
    #[msg("Identity already exists")]
    IdentityAlreadyExists,
    #[msg("Identity does not exist")]
    IdentityNonExistent,
}
