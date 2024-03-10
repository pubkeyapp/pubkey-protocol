use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
      init,
      payer = fee_payer,
      space = Profile::size(&[authority.key()], &[]),
      seeds = [],
      bump
    )]
    pub profile: Account<'info, Profile>,

    pub authority: Signer<'info>,

    #[account(
      mut,
      constraint = fee_payer.key().ne(&authority.key()) @ PubkeyProfileError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create(ctx: Context<CreateProfile>, args: CreateProfileArgs) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let authority = ctx.accounts.authority.key();

    let CreateProfileArgs {
        username,
        avatar_url,
    } = args;

    profile.set_inner(Profile {
        bump: ctx.bumps.profile,
        username,
        avatar_url,
        authorities: vec![authority],
        identities: vec![],
    });

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateProfileArgs {
    pub username: String,
    pub avatar_url: String,
}
