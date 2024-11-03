use anchor_lang::prelude::*;

use crate::constants::*;
use crate::errors::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction()]
pub struct ProfileDelete<'info> {
  #[account(
      mut,
      seeds = [
        PREFIX,
        PROFILE,
        &profile.username.as_bytes()
      ],
      bump = profile.bump,
      constraint = profile.check_if_deletable(&authority.key()) @ ProtocolError::UnableToDeleteProfile,
      close = fee_payer, // close account and return lamports to payer
  )]
  pub profile: Account<'info, Profile>,
  #[account(
      mut,
      seeds = [&Pointer::hash_seed(&IdentityProvider::Solana, &authority.key().to_string())],
      bump = pointer.bump,
      has_one = profile @ ProtocolError::UnAuthorized,
      close = fee_payer
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

pub fn profile_delete(_ctx: Context<ProfileDelete>) -> Result<()> {
  Ok(())
}
