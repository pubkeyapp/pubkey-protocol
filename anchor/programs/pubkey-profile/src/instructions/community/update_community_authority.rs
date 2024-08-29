use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct InitiateUpdateAuthority<'info> {
    #[account(
        mut,
        seeds = [
            PREFIX,
            COMMUNITY,
            &community.slug.as_bytes()
        ],
        bump = community.bump,
        constraint = community.check_for_authority(&authority.key()) @ PubkeyProfileError::UnAuthorized,
    )]
    pub community: Account<'info, Community>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction()]
pub struct FinalizeUpdateAuthority<'info> {
    #[account(
        mut,
        seeds = [
            PREFIX,
            COMMUNITY,
            &community.slug.as_bytes()
        ],
        bump = community.bump,
        constraint = community.pending_authority == Some(new_authority.key()) @ PubkeyProfileError::UnAuthorized,
    )]
    pub community: Account<'info, Community>,
    pub new_authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CancelUpdateAuthority<'info> {
    #[account(
        mut,
        seeds = [
            PREFIX,
            COMMUNITY,
            &community.slug.as_bytes()
        ],
        bump = community.bump,
        constraint = community.check_for_authority(&authority.key()) @ PubkeyProfileError::UnAuthorized,
    )]
    pub community: Account<'info, Community>,
    pub authority: Signer<'info>,
}

pub fn initiate_update_authority(
    ctx: Context<InitiateUpdateAuthority>,
    args: InitiateUpdateAuthorityArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Creating community account
    let InitiateUpdateAuthorityArgs { new_authority } = args;

    // Set the pending_authority
    community.pending_authority = Some(new_authority);

    Ok(())
}

pub fn finalize_update_authority(ctx: Context<FinalizeUpdateAuthority>) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Update the authority to the new one
    community.authority = ctx.accounts.new_authority.key();
    community.pending_authority = None;

    Ok(())
}

pub fn cancel_update_authority(ctx: Context<CancelUpdateAuthority>) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Clear the pending_authority
    community.pending_authority = None;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitiateUpdateAuthorityArgs {
    pub new_authority: Pubkey,
}
