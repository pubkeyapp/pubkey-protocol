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
        x,
        discord,
        github,
        website,
        telegram,
        farcaster,
    } = args;

    // Update fields if they are provided
    if let Some(name) = name {
        require!(is_valid_name(&name), PubkeyProfileError::InvalidName);
        community.name = name;
    }

    if let Some(avatar_url) = avatar_url {
        require!(
            is_valid_url(&avatar_url),
            PubkeyProfileError::InvalidAvatarURL
        );
        community.avatar_url = avatar_url;
    }

    if let Some(x) = x {
        require!(is_valid_x(&x), PubkeyProfileError::InvalidXURL);
        community.x = Some(x);
    }

    if let Some(discord) = discord {
        require!(
            is_valid_discord(&discord),
            PubkeyProfileError::InvalidDiscordURL
        );
        community.discord = Some(discord);
    }

    if let Some(github) = github {
        require!(
            is_valid_github(&github),
            PubkeyProfileError::InvalidGitHubURL
        );
        community.github = Some(github);
    }

    if let Some(website) = website {
        require!(
            is_valid_url(&website),
            PubkeyProfileError::InvalidWebsiteURL
        );
        community.website = Some(website);
    }

    if let Some(telegram) = telegram {
        require!(
            is_valid_telegram(&telegram),
            PubkeyProfileError::InvalidTelegramURL
        );
        community.telegram = Some(telegram);
    }

    if let Some(farcaster) = farcaster {
        require!(
            is_valid_farcaster(&farcaster),
            PubkeyProfileError::InvalidFarcasterURL
        );
        community.farcaster = Some(farcaster);
    }

    Ok(())
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateCommunityDetailsArgs {
    pub avatar_url: Option<String>,
    pub discord: Option<String>,
    pub farcaster: Option<String>,
    pub github: Option<String>,
    pub name: Option<String>,
    pub telegram: Option<String>,
    pub website: Option<String>,
    pub x: Option<String>,
}
