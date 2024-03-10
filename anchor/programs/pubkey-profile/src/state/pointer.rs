use anchor_lang::prelude::*;

#[account]
pub struct Pointer {
    pub bump: u8,
}
