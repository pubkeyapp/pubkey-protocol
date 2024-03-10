use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct AddIdentity<'info> {
    pub system_program: Program<'info, System>,
}

pub fn add(ctx: Context<AddIdentity>, args: AddIdentityArgs) -> Result<()> {
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AddIdentityArgs {}
