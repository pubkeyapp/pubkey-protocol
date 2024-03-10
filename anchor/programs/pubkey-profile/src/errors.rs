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
}
