use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct CommunityUpdateAuthorityInitiate<'info> {
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

#[derive(Accounts)]
#[instruction()]
pub struct CommunityUpdateAuthorityFinalize<'info> {
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

#[derive(Accounts)]
#[instruction()]
pub struct CommunityUpdateAuthorityCancel<'info> {
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

pub fn community_update_authority_initiate(
    ctx: Context<CommunityUpdateAuthorityInitiate>,
    args: CommunityUpdateAuthorityInitiateArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Creating community account
    let CommunityUpdateAuthorityInitiateArgs { new_authority } = args;

    // Set the pending_authority
    community.pending_authority = Some(new_authority);

    Ok(())
}

pub fn community_update_authority_finalize(ctx: Context<CommunityUpdateAuthorityFinalize>) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Update the authority to the new one
    community.authority = ctx.accounts.new_authority.key();
    community.pending_authority = None;

    Ok(())
}

pub fn community_update_authority_cancel(ctx: Context<CommunityUpdateAuthorityCancel>) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Clear the pending_authority
    community.pending_authority = None;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CommunityUpdateAuthorityInitiateArgs {
    pub new_authority: Pubkey,
}
