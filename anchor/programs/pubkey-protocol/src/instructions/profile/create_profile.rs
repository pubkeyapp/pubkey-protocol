use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: CreateProfileArgs)]
pub struct CreateProfile<'info> {
    #[account(
      init,
      payer = fee_payer,
      space = Profile::size(&[authority.key()], &[]),
      seeds = [
        PREFIX,
        PROFILE,
        &args.username.as_bytes()
      ],
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
    let fee_payer = ctx.accounts.fee_payer.key();

    // Creating profile account
    let CreateProfileArgs {
        username,
        name,
        avatar_url,
    } = args;

    profile.set_inner(Profile {
        bump: ctx.bumps.profile,
        username,
        name,
        avatar_url,
        fee_payer,
        authorities: vec![authority],
        identities: vec![],
    });

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateProfileArgs {
    pub username: String,
    pub name: String,
    pub avatar_url: String,
}
