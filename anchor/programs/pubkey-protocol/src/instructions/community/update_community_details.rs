use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: UpdateCommunityDetailsArgs)]
pub struct UpdateCommunityDetails<'info> {
    #[account(
        mut,
        seeds = [
            PREFIX,
            COMMUNITY,
            &community.slug.as_bytes()
        ],
        bump = community.bump,
        has_one = authority @ PubkeyProfileError::UnAuthorized,
    )]
    pub community: Account<'info, Community>,
    #[account(
        mut,
        constraint = community.check_for_authority(&authority.key()) @ PubkeyProfileError::UnAuthorized)]
    pub authority: Signer<'info>,
}

pub fn update_community_details(
    ctx: Context<UpdateCommunityDetails>,
    args: UpdateCommunityDetailsArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;

    // Creating community account
    let UpdateCommunityDetailsArgs {
        name,
        avatar_url,
    } = args;

    // Update fields if they are provided
    if let Some(avatar_url) = avatar_url {
        require!(
            is_valid_url(&avatar_url),
            PubkeyProfileError::InvalidAvatarURL
        );
        community.avatar_url = avatar_url;
    }
    if let Some(name) = name {
        require!(is_valid_name(&name), PubkeyProfileError::InvalidName);
        community.name = name;
    }

    Ok(())
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateCommunityDetailsArgs {
    pub avatar_url: Option<String>,
    pub name: Option<String>,
}
