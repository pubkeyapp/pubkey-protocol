use anchor_lang::prelude::*;

#[error_code]
pub enum PubkeyProfileError {
    #[msg("Account unauthorized to perform this action")]
    UnAuthorized,
}
