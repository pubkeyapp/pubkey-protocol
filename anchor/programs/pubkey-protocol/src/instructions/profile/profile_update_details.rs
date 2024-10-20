use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: UpdateProfileDetailsArgs)]
pub struct UpdateProfileDetails<'info> {
    #[account(
      mut,
      seeds = [
        PREFIX,
        PROFILE,
        &profile.username.as_bytes()
      ],
      bump = profile.bump,
      has_one = fee_payer @ ProtocolError::UnAuthorized,
      constraint = profile.check_for_authority(&args.authority) @ ProtocolError::UnAuthorized
    )]
    pub profile: Account<'info, Profile>,

    #[account(
      mut,
      constraint = fee_payer.key().ne(&args.authority) @ ProtocolError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,
}

pub fn profile_update_details(
    ctx: Context<UpdateProfileDetails>,
    args: UpdateProfileDetailsArgs,
) -> Result<()> {
    let profile = &mut ctx.accounts.profile;

    if let Some(new_name) = args.new_name {
        require!(is_valid_name(&new_name), ProtocolError::InvalidName);
        profile.name = new_name;
    }

    if let Some(new_avatar_url) = args.new_avatar_url {
        require!(
            is_valid_url(&new_avatar_url),
            ProtocolError::InvalidAvatarURL
        );
        profile.avatar_url = new_avatar_url;
    }

    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateProfileDetailsArgs {
    pub authority: Pubkey,
    pub new_name: Option<String>,
    pub new_avatar_url: Option<String>,
}
