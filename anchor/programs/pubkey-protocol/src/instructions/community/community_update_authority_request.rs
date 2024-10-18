use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CommunityUpdateAuthorityRequest<'info> {
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

pub fn community_update_authority_request(
    ctx: Context<CommunityUpdateAuthorityRequest>,
    args: CommunityUpdateAuthorityRequestArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Set the pending_authority
    community.pending_authority = Some(args.new_authority);

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CommunityUpdateAuthorityRequestArgs {
    pub new_authority: Pubkey,
}
