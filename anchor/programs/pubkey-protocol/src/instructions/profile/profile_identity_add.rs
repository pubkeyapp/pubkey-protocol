use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: ProfileIdentityAddArgs)]
pub struct ProfileIdentityAdd<'info> {
    #[account(
      mut,
      seeds = [
        PREFIX,
        PROFILE,
        &profile.username.as_bytes()
      ],
      bump = profile.bump,
      constraint = profile.check_for_authority(&authority.key()) @ ProtocolError::UnAuthorized
    )]
    pub profile: Account<'info, Profile>,

    #[account(
      init,
      space = Pointer::size(),
      payer = fee_payer,
      seeds = [&Pointer::hash_seed(&args.provider, &args.provider_id)],
      bump,
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

pub fn profile_identity_add(
    ctx: Context<ProfileIdentityAdd>,
    args: ProfileIdentityAddArgs,
) -> Result<()> {
    let community = &ctx.accounts.community;
    let fee_payer = &ctx.accounts.fee_payer;
    let pointer = &mut ctx.accounts.pointer;
    let profile = &mut ctx.accounts.profile;
    let system_program = &ctx.accounts.system_program;

    // Initializing pointer account
    pointer.bump = ctx.bumps.pointer;
    pointer.provider = args.provider.clone();
    pointer.provider_id = args.provider_id.clone();
    pointer.profile = profile.key();
    pointer.validate()?;

    let provider = args.provider.clone();

    // Adding identity to profile
    let identity = Identity {
        provider: args.provider,
        provider_id: args.provider_id,
        name: args.name,
        communities: vec![community.key()],
    };

    identity.validate()?;

    match profile
        .identities
        .iter()
        .position(|identity| identity.provider == provider)
    {
        Some(_) => return err!(ProtocolError::IdentityAlreadyExists),
        None => profile.identities.push(identity),
    }

    let new_profile_size = Profile::size(&profile.authorities, &profile.identities);

    realloc_account(
        profile.to_account_info(),
        new_profile_size,
        fee_payer.to_account_info(),
        system_program.to_account_info(),
    )?;

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct ProfileIdentityAddArgs {
    provider: IdentityProvider,
    provider_id: String,
    name: String,
}
