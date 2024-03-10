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
    #[msg("Account not owned by program")]
    InvalidAccountOwner,
    #[msg("Authority already exists")]
    AuthorityAlreadyExists,
    #[msg("Cannot remove last remaining authority")]
    CannotRemoveSoloAuthority,
    #[msg("Authority does not exist")]
    AuthorityNonExistant,
    #[msg("Array reached max size")]
    MaxSizeReached,
}
