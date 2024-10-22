use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CommunityAuthorityDecline<'info> {
    #[account(
        mut,
        seeds = [
            PREFIX,
            COMMUNITY,
            &community.slug.as_bytes()
        ],
        bump = community.bump,
        constraint = community.check_for_authority(&authority.key()) @ ProtocolError::UnAuthorized,
    )]
    pub community: Account<'info, Community>,
    pub authority: Signer<'info>,
}

pub fn community_authority_decline(
    ctx: Context<CommunityAuthorityDecline>,
) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Clear the pending_authority
    community.pending_authority = None;

    Ok(())
}
