use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: CommunitySignerRemoveArgs)]
pub struct CommunitySignerRemove<'info> {
    #[account(
        mut,
        seeds = [
            PREFIX,
            COMMUNITY,
            &community.slug.as_bytes()
        ],
        bump = community.bump,
        has_one = authority @ ProtocolError::UnAuthorized,
    )]
    pub community: Account<'info, Community>,

    #[account(
      mut,
      constraint = community.check_for_authority(&authority.key()) @ ProtocolError::UnAuthorized)
    ]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn community_signer_remove(
    ctx: Context<CommunitySignerRemove>,
    args: CommunitySignerRemoveArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;
    let signer = args.signer;

    // Ensure the signer is in the community.signers vector
    require!(
        community.signers.contains(&signer),
        ProtocolError::SignerDoesNotExist
    );

    // Ensure there is at least one signer left after removing this signer
    require!(community.signers.len() > 1, ProtocolError::SignerRequired);

    // Remove the signer from the community.signers vector
    community.signers.retain(|s| !s.eq(&signer));

    // Calculate the new account size
    let new_account_size = Community::size(&community.signers, &community.providers);

    // Reallocate the account if necessary
    realloc_account(
        community.to_account_info(),
        new_account_size,
        ctx.accounts.authority.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    )?;

    // Validate the updated community
    community.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CommunitySignerRemoveArgs {
    pub signer: Pubkey,
}
