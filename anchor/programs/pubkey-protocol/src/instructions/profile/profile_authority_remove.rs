use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct ProfileAuthorityRemove<'info> {
    #[account(
      mut,
      seeds = [
        PREFIX,
        PROFILE,
        &profile.username.as_bytes()
      ],
      bump = profile.bump,
      has_one = fee_payer @ ProtocolError::UnAuthorized,
      constraint = profile.check_for_authority(&authority.key()) @ ProtocolError::UnAuthorized
    )]
    pub profile: Account<'info, Profile>,

    pub authority: Signer<'info>,

    #[account(
      mut,
      constraint = fee_payer.key().ne(&authority.key()) @ ProtocolError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,
}

pub fn profile_authority_remove(
    ctx: Context<ProfileAuthorityRemove>,
    args: ProfileAuthorityRemoveArgs,
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let authority_to_remove = args.authority_to_remove;

    require!(
        profile.authorities.len() > 1,
        ProtocolError::CannotRemoveLastAuthority
    );

    // TODO: Not sure if this check should be there
    // require!(authority_to_remove.ne(&ctx.accounts.authority.key()), "Cannot remove yourself");

    match profile.authorities.binary_search(&authority_to_remove) {
        Ok(authority_to_remove_index) => {
            profile.authorities.remove(authority_to_remove_index);
        }
        Err(_) => return err!(ProtocolError::AuthorityNonExistent),
    }

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProfileAuthorityRemoveArgs {
    pub authority_to_remove: Pubkey,
}
