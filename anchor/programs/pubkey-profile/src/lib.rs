#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use instructions::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

declare_id!("PPLxLRPKPFvjKf3Xe48gXxispUXAuGb8GgkzG9aJetB");

#[program]
pub mod pubkey_profile {
    use super::*;

    pub fn create_profile(ctx: Context<CreateProfile>, args: CreateProfileArgs) -> Result<()> {
        profile::create(ctx, args)
    }

    pub fn update_avatar_url(
        ctx: Context<UpdateAvatarUrl>,
        args: UpdateAvatarUrlArgs,
    ) -> Result<()> {
        profile::update_avatar_url(ctx, args)
    }

    pub fn add_authority(ctx: Context<AddAuthority>, args: AddAuthorityArgs) -> Result<()> {
        profile::add_authority(ctx, args)
    }

    pub fn remove_authority(
        ctx: Context<RemoveAuthority>,
        args: RemoveAuthorityArgs,
    ) -> Result<()> {
        profile::remove_authority(ctx, args)
    }

    pub fn add_identity(ctx: Context<AddIdentity>, args: AddIdentityArgs) -> Result<()> {
        identity::add(ctx, args)
    }

    pub fn remove_identity(ctx: Context<RemoveIdentity>, args: RemoveIdentityArgs) -> Result<()> {
        identity::remove(ctx, args)
    }
}
