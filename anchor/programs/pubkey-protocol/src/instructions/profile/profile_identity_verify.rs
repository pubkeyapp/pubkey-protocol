use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: ProfileIdentityVerifyArgs)]
pub struct ProfileIdentityVerify<'info> {
    #[account(mut)]
    pub profile: Account<'info, Profile>,

    #[account(
        seeds = [&Pointer::hash_seed(&args.provider, &args.provider_id)],
        bump,
      )]
    pub pointer: Account<'info, Pointer>,

    pub authority: Signer<'info>,

    pub community: Account<'info, Community>,

    #[account(
      mut,
      constraint = community.check_for_signer(&fee_payer.key()) @ ProtocolError::UnAuthorizedCommunitySigner,
    )]
    pub fee_payer: Signer<'info>,
}

pub fn profile_identity_verify(
    ctx: Context<ProfileIdentityVerify>,
    args: ProfileIdentityVerifyArgs,
) -> Result<()> {
    let community = &ctx.accounts.community;
    let profile = &mut ctx.accounts.profile;
    let authority = &ctx.accounts.authority;
    let pointer = &mut ctx.accounts.pointer;

    require!(
        community.check_for_authority(&authority.key()),
        ProtocolError::UnAuthorized
    );

    // Check if the pointer exists and matches the provided args
    require!(
        pointer.provider == args.provider && pointer.provider_id == args.provider_id,
        ProtocolError::IdentityNonExistent
    );

    // Check if the community has a valid IdentityProvider
    if community.providers.iter().any(|p| *p == args.provider) {
        // Find the corresponding identity in the profile
        if let Some(identity) = profile
            .identities
            .iter_mut()
            .find(|i| i.provider == args.provider && i.provider_id == args.provider_id)
        {
            // Add the community to the identity's communities list if it's not already there
            if !identity.communities.contains(&community.key()) {
                identity.communities.push(community.key());
            }
        } else {
            return Err(ProtocolError::InvalidProviderIDNotFound.into());
        }
    } else {
        return Err(ProtocolError::InvalidProviderIDNotFound.into());
    }

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct ProfileIdentityVerifyArgs {
    provider: IdentityProvider,
    provider_id: String,
}
