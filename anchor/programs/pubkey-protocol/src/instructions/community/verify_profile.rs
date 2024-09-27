use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct VerifyProfileForCommunity<'info> {
    #[account(mut)]
    pub community: Account<'info, Community>,
    #[account(mut)]
    pub profile: Account<'info, Profile>,
    #[account(
        init,
        payer = fee_payer,
        space = CommunityVerification::size(),
        seeds = [
            PREFIX,
            COMMUNITY_VERIFICATION,
            community.key().as_ref(),
            profile.key().as_ref(),
        ],
        bump
    )]
    pub community_verification: Account<'info, CommunityVerification>,
    #[account(constraint = authority.key() == community.authority @ PubkeyProfileError::UnauthorizedCommunityAction)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn verify_profile(ctx: Context<VerifyProfileForCommunity>) -> Result<()> {
    let community = &ctx.accounts.community;
    let profile = &ctx.accounts.profile;
    let community_verification = &mut ctx.accounts.community_verification;
    let authority = &ctx.accounts.authority;

    // Set up the CommunityVerification account
    community_verification.set_inner(CommunityVerification {
        bump: ctx.bumps.community_verification,
        profile: profile.key(),
        community: community.key(),
        verified_at: Clock::get()?.unix_timestamp,
        verified_by: authority.key(),
    });

    // Adds the community verification to the user profile account
    ctx.accounts.profile.add_community_verification(community_verification.key())?;

    Ok(())
}

#[account]
pub struct CommunityVerification {
    pub bump: u8,
    pub profile: Pubkey,
    pub community: Pubkey,
    pub verified_at: i64,
    pub verified_by: Pubkey,
}

impl CommunityVerification {
    pub fn size() -> usize {
        8 + // discriminator
        1 + // bump
        32 + // profile
        32 + // community
        8 + // verified_at
        32 // verified_by
    }
}