use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
pub struct AddAuthority<'info> {
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
    pub system_program: Program<'info, System>,
}

pub fn add_authority(ctx: Context<AddAuthority>, args: AddAuthorityArgs) -> Result<()> {
    let profile = &mut ctx.accounts.profile;

    let fee_payer = &mut ctx.accounts.fee_payer;
    let system_program = &ctx.accounts.system_program;

    let new_authority = args.new_authority;

    match profile.authorities.binary_search(&new_authority) {
        Ok(_) => return err!(PubkeyProfileError::AuthorityAlreadyExists),
        Err(new_authority_index) => profile
            .authorities
            .insert(new_authority_index, new_authority),
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
pub struct AddAuthorityArgs {
    pub new_authority: Pubkey,
}
