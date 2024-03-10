use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateAvatarUrl<'info> {
    pub system_program: Program<'info, System>,
}

pub fn update_avatar_url(ctx: Context<UpdateAvatarUrl>, args: UpdateAvatarUrlArgs) -> Result<()> {
    Ok(())
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateAvatarUrlArgs {}
