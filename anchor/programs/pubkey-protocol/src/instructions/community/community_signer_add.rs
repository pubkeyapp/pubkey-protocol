use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: CommunitySignerAddArgs)]
pub struct CommunitySignerAdd<'info> {
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

pub fn community_signer_add(
    ctx: Context<CommunitySignerAdd>,
    args: CommunitySignerAddArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;
    let signer = args.signer;

    // Check if the signer is already in the community.signers vector
    require!(
        !community.signers.contains(&signer),
        ProtocolError::SignerAlreadyExists
    );

    // Add the signer to the community.signers vector
    community.signers.push(signer);

    // Sort the signers vector
    community.signers.sort();

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
pub struct CommunitySignerAddArgs {
    pub signer: Pubkey,
}
