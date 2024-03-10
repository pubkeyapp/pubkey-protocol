use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct RemoveAuthority<'info> {
    pub system_program: Program<'info, System>,
}

pub fn remove_authority(ctx: Context<RemoveAuthority>, args: RemoveAuthorityArgs) -> Result<()> {
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct RemoveAuthorityArgs {}
