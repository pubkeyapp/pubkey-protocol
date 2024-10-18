use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: CommunityProviderDisableArgs)]
pub struct CommunityProviderDisable<'info> {
    #[account(mut)]
    pub community: Account<'info, Community>,

    #[account(constraint = community.check_for_authority(&authority.key()) @ ProtocolError::UnAuthorized)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub fee_payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn community_provider_disable(
    ctx: Context<CommunityProviderDisable>,
    args: CommunityProviderDisableArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;
    let authority = &ctx.accounts.authority;

    require!(
        community.check_for_authority(&authority.key()),
        ProtocolError::UnAuthorized
    );

    // Make sure the provider is enabled
    require!(
        community.providers.contains(&args.provider),
        ProtocolError::ProviderDoesNotExist
    );

    // We can not disable the Solana provider
    require!(
        args.provider != IdentityProvider::Solana,
        ProtocolError::CannotRemoveSolanaProvider
    );

    // Remove the provider from the community
    community.providers.retain(|p| *p != args.provider);

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct CommunityProviderDisableArgs {
    pub provider: IdentityProvider,
}
