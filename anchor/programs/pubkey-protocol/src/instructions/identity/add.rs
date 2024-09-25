use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: AddIdentityArgs)]
pub struct AddIdentity<'info> {
    #[account(
      mut,
      seeds = [
        PREFIX,
        PROFILE,
        &profile.username.as_bytes()
      ],
      bump = profile.bump,
      has_one = fee_payer @ PubkeyProfileError::UnAuthorized,
      constraint = profile.check_for_authority(&authority.key()) @ PubkeyProfileError::UnAuthorized
    )]
    pub profile: Account<'info, Profile>,

    #[account(
      init,
      space = Pointer::size(),
      payer = fee_payer,
      seeds = [&Pointer::hash_seed(&args.provider, &args.provider_id)],
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

pub fn add(ctx: Context<AddIdentity>, args: AddIdentityArgs) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let pointer = &mut ctx.accounts.pointer;
    let fee_payer = &ctx.accounts.fee_payer;
    let system_program = &ctx.accounts.system_program;

    // Initializing pointer account
    pointer.bump = ctx.bumps.pointer;
    pointer.provider = args.provider.clone();
    pointer.provider_id = args.provider_id.clone();
    pointer.profile = profile.key();
    pointer.validate()?;

    // Adding identity to profile
    let identity = Identity {
        provider: args.provider,
        provider_id: args.provider_id.clone(),
        name: args.nickname,
    };

    match profile
        .identities
        .binary_search_by_key(&args.provider_id, |identity| identity.provider_id.clone())
    {
        Ok(_) => return err!(PubkeyProfileError::IdentityAlreadyExists),
        Err(new_identity_index) => profile.identities.insert(new_identity_index, identity),
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

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AddIdentityArgs {
    provider: PubKeyIdentityProvider,
    provider_id: String,
    nickname: String,
}
