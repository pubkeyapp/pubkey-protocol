use anchor_lang::prelude::*;

#[error_code]
pub enum PubkeyProfileError {
    #[msg("Account unauthorized to perform this action")]
    UnAuthorized,
    #[msg("Invalid Fee payer")]
    InvalidFeePayer,
    #[msg("Invalid Username")]
    InvalidUsername,
    #[msg("Invalid Avatar Url")]
    InvalidAvatarURL,
    #[msg("Invalid Provider")]
    InvalidProvider,
    #[msg("Invalid Provider ID")]
    InvalidProviderID,
    #[msg("Invalid Name")]
    InvalidName,
    #[msg("Account not owned by program")]
    InvalidAccountOwner,
    #[msg("Authority already exists")]
    AuthorityAlreadyExists,
    #[msg("Authority does not exist")]
    AuthorityNonExistant,
    #[msg("Cannot remove last remaining authority")]
    CannotRemoveSoloAuthority,
    #[msg("Array reached max size")]
    MaxSizeReached,
    #[msg("Identity already exists")]
    IdentityAlreadyExists,
    #[msg("Identity does not exist")]
    IdentityNonExistant,
}
