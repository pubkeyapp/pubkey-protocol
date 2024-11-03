use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: ProfileUpdateArgs)]
pub struct ProfileUpdate<'info> {
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

    pub authority: Signer<'info>,
    pub community: Account<'info, Community>,

    #[account(
      mut,
      constraint = community.check_for_signer(&fee_payer.key()) @ ProtocolError::UnAuthorizedCommunitySigner,
    )]
    pub fee_payer: Signer<'info>,
}

pub fn profile_update(
    ctx: Context<ProfileUpdate>,
    args: ProfileUpdateArgs,
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

    if let Some(new_bio) = args.new_bio {
        require!(
            new_bio.len() <= MAX_BIO_SIZE,
            ProtocolError::InvalidBioSize
        );
        profile.bio = Some(new_bio);
    }
    profile.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ProfileUpdateArgs {
    pub new_name: Option<String>,
    pub new_avatar_url: Option<String>,
    pub new_bio: Option<String>,  
}
