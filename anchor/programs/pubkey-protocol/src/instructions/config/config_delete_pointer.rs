use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct ConfigDeletePointer<'info> {
    #[account(mut)]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        constraint = config.check_for_config_authority(&config_authority.key()) @ ProtocolError::UnAuthorizedCommunityAuthority
    )]
    pub config_authority: Signer<'info>,
    #[account(
      mut,
      close = config_authority,
    )]
    pub pointer: Account<'info, Pointer>,
}

pub fn config_delete_pointer(_ctx: Context<ConfigDeletePointer>) -> Result<()> {
    Ok(())
}
