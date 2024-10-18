use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: CommunityProviderEnableArgs)]
pub struct CommunityProviderEnable<'info> {
    #[account(mut)]
    pub community: Account<'info, Community>,

    #[account(constraint = community.check_for_authority(&authority.key()) @ ProtocolError::UnAuthorized)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub fee_payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn community_provider_enable(
    ctx: Context<CommunityProviderEnable>,
    args: CommunityProviderEnableArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;
    let authority = &ctx.accounts.authority;

    require!(
        community.check_for_authority(&authority.key()),
        ProtocolError::UnAuthorized
    );

    // Check if the provider already exists in the community
    require!(
        !community.providers.contains(&args.provider),
        ProtocolError::ProviderAlreadyExists
    );

    // Add the new provider to the community
    community.providers.push(args.provider);

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct CommunityProviderEnableArgs {
    pub provider: IdentityProvider,
}
