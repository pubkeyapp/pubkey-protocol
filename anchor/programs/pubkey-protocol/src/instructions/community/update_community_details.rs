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
        name,       // optional
        avatar_url, // optional
        x,          // optional
        discord,    // optional
        github,     // optional
        website,    // optional
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

    Ok(())
}

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct UpdateCommunityDetailsArgs {
    pub name: Option<String>,       // Optional name
    pub avatar_url: Option<String>, // Optional avatar URL
    pub x: Option<String>,          // Optional X (Twitter) URL
    pub discord: Option<String>,    // Optional Discord URL
    pub github: Option<String>,     // Optional GitHub URL
    pub website: Option<String>,    // Optional Website URL
}
