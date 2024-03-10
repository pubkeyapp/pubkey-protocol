use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: UpdateAvatarUrlArgs)]
pub struct UpdateAvatarUrl<'info> {
    #[account(
      mut,
      seeds = [
        PREFIX,
        PROFILE,
        &profile.username.as_bytes()
      ],
      bump = profile.bump,
      has_one = fee_payer @ PubkeyProfileError::UnAuthorized,
      constraint = profile.check_for_authority(&args.authority) @ PubkeyProfileError::UnAuthorized
    )]
    pub profile: Account<'info, Profile>,

    #[account(
      mut,
      constraint = fee_payer.key().ne(&args.authority) @ PubkeyProfileError::InvalidFeePayer
    )]
    pub fee_payer: Signer<'info>,
}

pub fn update_avatar_url(ctx: Context<UpdateAvatarUrl>, args: UpdateAvatarUrlArgs) -> Result<()> {
    let profile = &mut ctx.accounts.profile;
    let new_avatar_url = args.new_avatar_url;

    profile.avatar_url = new_avatar_url;
    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateAvatarUrlArgs {
    pub authority: Pubkey,
    pub new_avatar_url: String,
}
