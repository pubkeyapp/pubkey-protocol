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
      space = Profile::size(&[authority.key()], &[Identity { provider: IdentityProvider::Solana, provider_id: authority.key().to_string(), name: "Primary Wallet".to_owned(), communities: vec![] }]),
      seeds = [
        PREFIX,
        PROFILE,
        &args.username.as_bytes()
      ],
      bump
    )]
    pub profile: Account<'info, Profile>,

    #[account(
      init,
      space = Pointer::size(),
      payer = fee_payer,
      seeds = [
        &Pointer::hash_seed(&IdentityProvider::Solana, &authority.key().to_string())
      ],
      bump
    )]
    pub pointer: Account<'info, Pointer>,

    pub authority: Signer<'info>,

    #[account(
      mut,
      constraint = fee_payer.key().ne(&authority.key()) @ ProtocolError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn create(ctx: Context<CreateProfile>, args: CreateProfileArgs) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let authority = ctx.accounts.authority.key();
    let fee_payer = ctx.accounts.fee_payer.key();
    let pointer = &mut ctx.accounts.pointer;

    // Creating pointer account
    pointer.set_inner(Pointer {
        bump: ctx.bumps.pointer,
        profile: profile.key(),
        provider: IdentityProvider::Solana,
        provider_id: authority.to_string(),
    });

    pointer.validate()?;

    // Creating profile account
    let CreateProfileArgs {
        username,
        name,
        avatar_url,
    } = args;

    let set_primary_wallet = Identity {
        provider: IdentityProvider::Solana,
        provider_id: authority.key().to_string(),
        name: "Primary Wallet".to_owned(),
        communities: vec![],
    };

    profile.set_inner(Profile {
        bump: ctx.bumps.profile,
        username,
        name,
        avatar_url,
        fee_payer,
        authorities: vec![authority],
        identities: vec![set_primary_wallet],
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
