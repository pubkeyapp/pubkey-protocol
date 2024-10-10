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
      init_if_needed, // dangerous as can be used for reinit but we mitigate with constraint check
      space = Pointer::size(),
      payer = fee_payer,
      seeds = [&Pointer::hash_seed(&args.provider, &args.provider_id)],
      bump,
      constraint = pointer.profile.key().eq(&profile.key()) @ PubkeyProfileError::IdentityProfileInvalid,
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

    let provider = args.provider.clone();

    // Adding identity to profile
    let identity = Identity {
        provider: args.provider,
        provider_id: match Pubkey::try_from(args.provider_id.as_str()) {
            Ok(pubkey) => identity::ProviderID::PubKey(pubkey),
            Err(_) => identity::ProviderID::String(args.provider_id),
        },
        name: args.name,
        communities: vec![],
    };

    identity.validate()?;

    match profile
        .identities
        .iter()
        .position(|identity| identity.provider == provider)
    {
        Some(_) => return err!(PubkeyProfileError::IdentityAlreadyExists),
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

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AddIdentityArgs {
    provider: PubKeyIdentityProvider,
    provider_id: String,
    name: String,
}
