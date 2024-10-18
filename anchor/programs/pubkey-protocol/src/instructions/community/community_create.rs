use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: CommunityCreateArgs)]
pub struct CommunityCreate<'info> {
    #[account(
      init,
      payer = fee_payer,
      space = Community::size(&[authority.key()], &[]),
      seeds = [
        PREFIX,
        COMMUNITY,
        &args.slug.as_bytes()
      ],
      bump
    )]
    pub community: Account<'info, Community>,
    pub authority: Signer<'info>,

    #[account(
      mut,
      constraint = fee_payer.key().ne(&authority.key()) @ ProtocolError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn community_create(ctx: Context<CommunityCreate>, args: CommunityCreateArgs) -> Result<()> {
    let community = &mut ctx.accounts.community;

    let authority = ctx.accounts.authority.key();
    let fee_payer = ctx.accounts.fee_payer.key();

    // Creating community account
    let CommunityCreateArgs {
        slug,
        name,
        avatar_url,
    } = args;

    community.set_inner(Community {
        authority,
        avatar_url,
        bump: ctx.bumps.community,
        fee_payers: vec![fee_payer],
        name,
        pending_authority: None,
        providers: vec![IdentityProvider::Solana],
        slug,
        discord: None,
        farcaster: None,
        github: None,
        telegram: None,
        website: None,
        x: None,
    });

    community.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CommunityCreateArgs {
    pub slug: String,
    pub avatar_url: String,
    pub name: String,
}
