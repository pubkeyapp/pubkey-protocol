use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: ProfileCreateArgs)]
pub struct ProfileCreate<'info> {
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

    pub community: Account<'info, Community>,

    #[account(
      mut,
      constraint = community.check_for_signer(&fee_payer.key()) @ ProtocolError::UnAuthorizedCommunitySigner,
    )]
    pub fee_payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn profile_create(ctx: Context<ProfileCreate>, args: ProfileCreateArgs) -> Result<()> {
    let authority = ctx.accounts.authority.key();
    let community = &ctx.accounts.community;
    let profile = &mut ctx.accounts.profile;
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
    let ProfileCreateArgs {
        username,
        name,
        avatar_url,
    } = args;

    let set_primary_wallet = Identity {
        provider: IdentityProvider::Solana,
        provider_id: authority.key().to_string(),
        name: "Primary Wallet".to_owned(),
        communities: vec![community.key()],
    };

    profile.set_inner(Profile {
        bump: ctx.bumps.profile,
        username,
        name,
        avatar_url,
        authorities: vec![authority],
        identities: vec![set_primary_wallet],
        bio: None,
    });

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProfileCreateArgs {
    pub username: String,
    pub name: String,
    pub avatar_url: String,
}
