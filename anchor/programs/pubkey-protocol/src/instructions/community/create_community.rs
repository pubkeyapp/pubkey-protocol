use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: CreateCommunityArgs)]
pub struct CreateCommunity<'info> {
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
      constraint = fee_payer.key().ne(&authority.key()) @ PubkeyProfileError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create_community(ctx: Context<CreateCommunity>, args: CreateCommunityArgs) -> Result<()> {
    let community = &mut ctx.accounts.community;

    let authority = ctx.accounts.authority.key();
    let fee_payer = ctx.accounts.fee_payer.key();

    // Creating community account
    let CreateCommunityArgs {
        slug,
        name,
        avatar_url,
        discord,
        farcaster,
        github,
        google,
        solana,
        telegram,
        website,
        x,
    } = args;

    community.set_inner(Community {
        bump: ctx.bumps.community,
        slug,
        name,
        avatar_url,
        fee_payers: vec![fee_payer],
        authority,
        pending_authority: None,
        providers: vec![],
        discord,
        farcaster,
        github,
        google,
        solana,
        telegram,
        website,
        x,
    });

    community.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateCommunityArgs {
    pub slug: String,
    pub avatar_url: String,
    pub name: String,
    pub discord: Option<String>,
    pub farcaster: Option<String>,
    pub github: Option<String>,
    pub google: Option<String>,
    pub solana: Option<Pubkey>,
    pub telegram: Option<String>,
    pub website: Option<String>,
    pub x: Option<String>,
}
