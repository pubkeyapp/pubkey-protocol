#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("DzWrqkdRfCTc9nQKc67KjVuSZpH7agSezbvZcYHEeLnK");

#[program]
pub mod pubkey_profile {
    use super::*;

  pub fn close(_ctx: Context<ClosePubkeyProfile>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.pubkey_profile.count = ctx.accounts.pubkey_profile.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.pubkey_profile.count = ctx.accounts.pubkey_profile.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializePubkeyProfile>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.pubkey_profile.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializePubkeyProfile<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + PubkeyProfile::INIT_SPACE,
  payer = payer
  )]
  pub pubkey_profile: Account<'info, PubkeyProfile>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ClosePubkeyProfile<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub pubkey_profile: Account<'info, PubkeyProfile>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub pubkey_profile: Account<'info, PubkeyProfile>,
}

#[account]
#[derive(InitSpace)]
pub struct PubkeyProfile {
  count: u8,
}
