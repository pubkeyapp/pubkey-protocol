use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
pub struct VerifyProfileForCommunity<'info> {
    #[account(mut)]
    pub community: Account<'info, Community>,
    #[account(mut)]
    pub profile: Account<'info, Profile>,
    #[account(constraint = community.check_for_authority(&authority.key()) @ PubkeyProfileError::UnAuthorized)]
    pub authority: Signer<'info>,
    #[account(mut)]
    pub fee_payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn verify_community_profile(
    ctx: Context<VerifyProfileForCommunity>,
    args: VerifyProfileForCommunityArgs,
) -> Result<()> {
    let community = &ctx.accounts.community;
    let profile = &mut ctx.accounts.profile;
    let authority = &ctx.accounts.authority;

    require!(
        community.check_for_authority(&authority.key()),
        PubkeyProfileError::UnAuthorized
    );

    // Check if the community has a valid PubKeyIdentityProvider
    if community.providers.iter().any(|p| *p == args.provider) {
        // Find the corresponding identity in the profile
        if let Some(identity) = profile
            .identities
            .iter_mut()
            .find(|i| i.provider == args.provider)
        {
            // Add the community to the identity's communities list if it's not already there
            if !identity.communities.contains(&community.key()) {
                identity.communities.push(community.key());
            }
        } else {
            return Err(PubkeyProfileError::InvalidProviderID.into());
        }
    } else {
        return Err(PubkeyProfileError::InvalidProviderID.into());
    }

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct VerifyProfileForCommunityArgs {
    pub provider: PubKeyIdentityProvider,
}
