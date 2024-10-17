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
    #[msg("Invalid Avatar Url")]
    InvalidAvatarURL,
    #[msg("Invalid Discord ID")]
    InvalidDiscordID,
    #[msg("Invalid Discord URL")]
    InvalidDiscordURL,
    #[msg("Invalid Farcaster ID")]
    InvalidFarcasterID,
    #[msg("Invalid Farcaster URL")]
    InvalidFarcasterURL,
    #[msg("Invalid Fee payer")]
    InvalidFeePayer,
    #[msg("Invalid GitHub ID")]
    InvalidGitHubID,
    #[msg("Invalid GitHub URL")]
    InvalidGitHubURL,
    #[msg("Invalid Google ID")]
    InvalidGoogleID,
    #[msg("Invalid Google URL")]
    InvalidGoogleURL,
    #[msg("Invalid Name")]
    InvalidName,
    #[msg("Invalid Provider ID (too long)")]
    InvalidProviderIDTooLong,
    #[msg("Invalid Provider ID (not found)")]
    InvalidProviderIDNotFound,
    #[msg("Invalid Provider Name (too long)")]
    InvalidProviderNameTooLong,
    #[msg("Invalid Slug")]
    InvalidSlug,
    #[msg("Invalid Solana Public Key")]
    InvalidSolanaPubKey,
    #[msg("Invalid Telegram ID")]
    InvalidTelegramID,
    #[msg("Invalid Telegram URL")]
    InvalidTelegramURL,
    #[msg("Invalid Username")]
    InvalidUsername,
    #[msg("Invalid Website URL")]
    InvalidWebsiteURL,
    #[msg("Invalid X ID")]
    InvalidXID,
    #[msg("Invalid X URL")]
    InvalidXURL,
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
