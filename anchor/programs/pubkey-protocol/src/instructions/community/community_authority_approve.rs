use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CommunityAuthorityApprove<'info> {
    #[account(
        mut,
        seeds = [
            PREFIX,
            COMMUNITY,
            &community.slug.as_bytes()
        ],
        bump = community.bump,
        constraint = community.pending_authority == Some(new_authority.key()) @ ProtocolError::UnAuthorized,
    )]
    pub community: Account<'info, Community>,
    pub new_authority: Signer<'info>,
}

pub fn community_authority_approve(
    ctx: Context<CommunityAuthorityApprove>,
) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Set the authority to the new one
    community.authority = ctx.accounts.new_authority.key();
    // Clear the pending_authority
    community.pending_authority = None;

    Ok(())
}
