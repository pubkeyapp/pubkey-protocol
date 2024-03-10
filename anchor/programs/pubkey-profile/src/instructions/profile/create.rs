use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    pub system_program: Program<'info, System>,
}

pub fn create(ctx: Context<CreateProfile>, args: CreateProfileArgs) -> Result<()> {
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct CreateProfileArgs {}
