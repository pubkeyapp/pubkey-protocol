use anchor_lang::prelude::*;

use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: AddCommunityProviderArgs)]
pub struct AddCommunityProvider<'info> {
    #[account(mut)]
    pub community: Account<'info, Community>,

    #[account(constraint = community.check_for_authority(&authority.key()) @ PubkeyProfileError::UnAuthorized)]
    pub authority: Signer<'info>,

    #[account(mut)]
    pub fee_payer: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn add_community_provider(
    ctx: Context<AddCommunityProvider>,
    args: AddCommunityProviderArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;
    let authority = &ctx.accounts.authority;

    require!(
        community.check_for_authority(&authority.key()),
        PubkeyProfileError::UnAuthorized
    );

    // Check if the provider already exists in the community
    require!(
        !community.providers.contains(&args.provider),
        PubkeyProfileError::ProviderAlreadyExists
    );

    // Add the new provider to the community
    community.providers.push(args.provider);

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct AddCommunityProviderArgs {
    pub provider: PubKeyIdentityProvider,
}