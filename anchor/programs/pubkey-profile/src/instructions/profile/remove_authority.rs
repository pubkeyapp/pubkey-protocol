use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct RemoveAuthority<'info> {
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

    pub authority: Signer<'info>,

    #[account(
      mut,
      constraint = fee_payer.key().ne(&authority.key()) @ PubkeyProfileError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,
}

pub fn remove_authority(ctx: Context<RemoveAuthority>, args: RemoveAuthorityArgs) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let authority_to_remove = args.authority_to_remove;

    require!(
        profile.authorities.len() > 1,
        PubkeyProfileError::CannotRemoveSoloAuthority
    );

    // TODO: Not sure if this check should be there
    // require!(authority_to_remove.ne(&ctx.accounts.authority.key()), "Cannot remove yourself");

    match profile.authorities.binary_search(&authority_to_remove) {
        Ok(authority_to_remove_index) => {
            profile.authorities.remove(authority_to_remove_index);
        }
        Err(_) => return err!(PubkeyProfileError::AuthorityNonExistent),
    }

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct RemoveAuthorityArgs {
    pub authority_to_remove: Pubkey,
}
