use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: ProfileIdentityRemoveArgs)]
pub struct ProfileIdentityRemove<'info> {
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
      mut,
      seeds = [&Pointer::hash_seed(&pointer.provider, &args.provider_id)],
      bump = pointer.bump,
      has_one = profile @ ProtocolError::UnAuthorized,
      close = fee_payer
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

pub fn profile_identity_remove(
    ctx: Context<ProfileIdentityRemove>,
    args: ProfileIdentityRemoveArgs,
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let provider = ctx.accounts.pointer.provider.clone();

    // FIXME: Check if the Solana wallet always exists - you can't delete the last IdentityProvider::Solana

    match profile.identities.iter().position(|identity| {
        identity.provider == provider && identity.provider_id == args.provider_id
    }) {
        Some(identity_to_remove_index) => {
            profile.identities.remove(identity_to_remove_index);
        }
        None => return err!(ProtocolError::IdentityNonExistent),
    }

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProfileIdentityRemoveArgs {
    pub provider_id: String,
}
