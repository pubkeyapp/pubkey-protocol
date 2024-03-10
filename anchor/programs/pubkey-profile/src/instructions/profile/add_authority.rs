use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct AddAuthority<'info> {
    pub system_program: Program<'info, System>,
}

pub fn add_authority(ctx: Context<AddAuthority>, args: AddAuthorityArgs) -> Result<()> {
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AddAuthorityArgs {}
