use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: RemoveIdentityArgs)]
pub struct RemoveIdentity<'info> {
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
      mut,
      seeds = [&Pointer::hash_seed(&args.provider, &args.provider_id)],
      bump = pointer.bump,
      has_one = profile @ PubkeyProfileError::UnAuthorized,
      close = fee_payer
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

pub fn remove(ctx: Context<RemoveIdentity>, args: RemoveIdentityArgs) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let provider = args.provider.clone();

    match profile
        .identities
        .iter()
        .position(|identity| identity.provider == provider)
    {
        Some(identity_to_remove_index) => {
            profile.identities.remove(identity_to_remove_index);
        }
        None => return err!(PubkeyProfileError::IdentityNonExistent),
    }

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct RemoveIdentityArgs {
    pub provider: PubKeyIdentityProvider,
    pub provider_id: String,
}
