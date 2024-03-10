use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RemoveIdentity<'info> {
    pub system_program: Program<'info, System>,
}

pub fn remove(ctx: Context<RemoveIdentity>, args: RemoveIdentityArgs) -> Result<()> {
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct RemoveIdentityArgs {}
