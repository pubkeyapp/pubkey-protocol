use anchor_lang::prelude::*;

#[error_code]
pub enum PubkeyProfileError {
    #[msg("Account not owned by program")]
    InvalidAccountOwner,
    #[msg("Account too large")]
    AccountTooLarge,
    #[msg("Account unauthorized to perform this action")]
    UnAuthorized,
    #[msg("Authority already exists")]
    AuthorityAlreadyExists,
    #[msg("Authority does not exist")]
    AuthorityNonExistent,
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
    #[msg("Invalid Google URL")]
    InvalidGoogleURL,
    #[msg("Invalid GitHub URL")]
    InvalidGitHubURL,
    #[msg("Invalid Solana Public Key")]
    InvalidSolanaPubKey,
    #[msg("Invalid Telegram URL")]
    InvalidTelegramURL,
    #[msg("Invalid Provider ID")]
    InvalidProviderID,
    #[msg("Invalid Provider Name")]
    InvalidProviderName,
    #[msg("Invalid Identity Profile Authority")]
    IdentityProfileInvalid,
    #[msg("Cannot remove last remaining authority")]
    CannotRemoveSoloAuthority,
    #[msg("Array reached max size")]
    MaxSizeReached,
    #[msg("Identity already exists")]
    IdentityAlreadyExists,
    #[msg("Identity does not exist")]
    IdentityNonExistent,
    #[msg("Unauthorized community action")]
    UnauthorizedCommunityAction,
    #[msg("Community verification already exists")]
    CommunityVerificationAlreadyExists,
    #[msg("Provider already exists")]
    ProviderAlreadyExists,
}
