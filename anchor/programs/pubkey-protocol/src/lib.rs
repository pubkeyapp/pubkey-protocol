#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use instructions::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;
pub mod utils;

declare_id!("PUBKEYsiC4c87gFa5qGcH7t6VobVu3A4QqPUA2wzvam");

#[program]
pub mod pubkey_protocol {
  use super::*;

  // Profile Actions
    pub fn create_profile(ctx: Context<CreateProfile>, args: CreateProfileArgs) -> Result<()> {
        profile::create(ctx, args)
    }

    pub fn update_profile_details(
        ctx: Context<UpdateProfileDetails>,
        args: UpdateProfileDetailsArgs,
    ) -> Result<()> {
        profile::update_profile_details(ctx, args)
    }

    pub fn add_profile_authority(ctx: Context<AddAuthority>, args: AddAuthorityArgs) -> Result<()> {
        profile::add_authority(ctx, args)
    }

    pub fn remove_authority(
        ctx: Context<RemoveAuthority>,
        args: RemoveAuthorityArgs,
    ) -> Result<()> {
        profile::remove_authority(ctx, args)
    }

    // Identity Actions
    pub fn add_identity(ctx: Context<AddIdentity>, args: AddIdentityArgs) -> Result<()> {
        identity::add(ctx, args)
    }

    pub fn remove_identity(ctx: Context<RemoveIdentity>, args: RemoveIdentityArgs) -> Result<()> {
        identity::remove(ctx, args)
    }

    // Community Actions
    pub fn community_create(
        ctx: Context<CommunityCreate>,
        args: CommunityCreateArgs,
    ) -> Result<()> {
        community::community_create(ctx, args)
    }

    pub fn community_provider_disable(
        ctx: Context<CommunityProviderDisable>,
        args: CommunityProviderDisableArgs,
    ) -> Result<()> {
        community::community_provider_disable(ctx, args)
    }

    pub fn community_provider_enable(
        ctx: Context<CommunityProviderEnable>,
        args: CommunityProviderEnableArgs,
    ) -> Result<()> {
        community::community_provider_enable(ctx, args)
    }

    pub fn community_update_authority_cancel(
        ctx: Context<CommunityUpdateAuthorityCancel>,
    ) -> Result<()> {
        community::community_update_authority_cancel(ctx)
    }

    pub fn community_update_authority_finalize(
        ctx: Context<CommunityUpdateAuthorityFinalize>,
    ) -> Result<()> {
        community::community_update_authority_finalize(ctx)
    }

    pub fn community_update_authority_initiate(
        ctx: Context<CommunityUpdateAuthorityInitiate>,
        args: CommunityUpdateAuthorityInitiateArgs,
    ) -> Result<()> {
        community::community_update_authority_initiate(ctx, args)
    }

    pub fn community_update_details(
        ctx: Context<UpdateCommunityDetails>,
        args: UpdateCommunityDetailsArgs,
    ) -> Result<()> {
        community::community_update_details(ctx, args)
    }

    pub fn community_update_feepayers(
        ctx: Context<UpdateFeePayers>,
        args: UpdateFeePayersArgs,
    ) -> Result<()> {
        community::community_update_feepayers(ctx, args)
    }

    pub fn verify_profile_identity(
        ctx: Context<VerifyProfileIdentity>,
        args: VerifyProfileIdentityArgs,
    ) -> Result<()> {
        community::verify_profile_identity(ctx, args)
    }
}
