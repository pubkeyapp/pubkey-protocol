use anchor_lang::prelude::*;

use crate::constants::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(args: ConfigInitArgs)]
pub struct ConfigInit<'info> {
    #[account(
      init,
      payer = authority,
      space = Config::size(),
      seeds = [ PREFIX, CONFIG ],
      bump
  )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn config_init(ctx: Context<ConfigInit>, args: ConfigInitArgs) -> Result<()> {
    let config = &mut ctx.accounts.config;

    let authority = ctx.accounts.authority.key();

    config.set_inner(Config {
        bump: ctx.bumps.config,
        community_authority: args.community_authority,
        config_authority: authority,
    });

    config.validate()?;

    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct ConfigInitArgs {
    pub community_authority: Pubkey,
}
