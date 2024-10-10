use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;
use crate::utils::*;

#[derive(Accounts)]
#[instruction(args: UpdateFeePayersArgs)]
pub struct UpdateFeePayers<'info> {
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

    #[account( mut, constraint = community.check_for_authority(&authority.key()) @ PubkeyProfileError::UnAuthorized)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn update_community_feepayers(
    ctx: Context<UpdateFeePayers>,
    args: UpdateFeePayersArgs,
) -> Result<()> {
    let community = &mut ctx.accounts.community;
    let new_fee_payers = args.new_fee_payers;

    // Update the fee_payers vector
    community.fee_payers = new_fee_payers;

    // Calculate the new account size
    let new_account_size = Community::size(&community.fee_payers, &community.providers);

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
pub struct UpdateFeePayersArgs {
    pub new_fee_payers: Vec<Pubkey>,
}
