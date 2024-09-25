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
      space = Community::size(&[authority.key()], &[Identity { provider: PubKeyIdentityProvider::Solana, provider_id: authority.key().to_string(), name: "Primary Wallet".to_owned() }]),
      seeds = [
        PREFIX,
        COMMUNITY,
        &args.slug.as_bytes()
      ],
      bump
    )]
    pub community: Account<'info, Community>,

    #[account(
      init,
      space = Pointer::size(),
      payer = fee_payer,
      seeds = [
        &Pointer::hash_seed(&PubKeyIdentityProvider::Solana, &authority.key().to_string())
      ],
      bump
    )]
    pub pointer: Account<'info, Pointer>,

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
    let pointer = &mut ctx.accounts.pointer;

    let authority = ctx.accounts.authority.key();
    let fee_payer = ctx.accounts.fee_payer.key();

    // FIXME: We don't need pointers for communities
    // Creating pointer account
    pointer.set_inner(Pointer {
        bump: ctx.bumps.pointer,
        profile: community.key(),
        provider: PubKeyIdentityProvider::Solana,
        provider_id: authority.to_string(),
    });

    pointer.validate()?;

    // Creating community account
    let CreateCommunityArgs {
        slug,
        name,
        avatar_url,
        x,       // optional
        discord, // optional
        github,  // optional
        website, // optional
    } = args;

    let identity = Identity {
        provider: PubKeyIdentityProvider::Solana,
        provider_id: authority.key().to_string(),
        name: "Primary Wallet".to_owned(),
    };

    community.set_inner(Community {
        bump: ctx.bumps.community,
        slug,
        name,
        avatar_url,
        fee_payers: vec![fee_payer],
        authority,
        pending_authority: None,
        providers: vec![identity],
        x,       // optional
        discord, // optional
        github,  // optional
        website, // optional
    });

    community.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateCommunityArgs {
    pub slug: String,
    pub name: String,
    pub avatar_url: String,
    pub x: Option<String>,
    pub discord: Option<String>,
    pub github: Option<String>,
    pub website: Option<String>,
}
