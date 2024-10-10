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
    pub fn create_community(
        ctx: Context<CreateCommunity>,
        args: CreateCommunityArgs,
    ) -> Result<()> {
        community::create_community(ctx, args)
    }

    pub fn update_community_details(
        ctx: Context<UpdateCommunityDetails>,
        args: UpdateCommunityDetailsArgs,
    ) -> Result<()> {
        community::update_community_details(ctx, args)
    }

    pub fn update_community_feepayers(
        ctx: Context<UpdateFeePayers>,
        args: UpdateFeePayersArgs,
    ) -> Result<()> {
        community::update_community_feepayers(ctx, args)
    }

    pub fn initiate_update_community_authority(
        ctx: Context<InitiateUpdateAuthority>,
        args: InitiateUpdateAuthorityArgs,
    ) -> Result<()> {
        community::initiate_update_authority(ctx, args)
    }

    pub fn finalize_update_community_authority(
        ctx: Context<FinalizeUpdateAuthority>,
    ) -> Result<()> {
        community::finalize_update_authority(ctx)
    }

    pub fn cancel_update_community_authority(ctx: Context<CancelUpdateAuthority>) -> Result<()> {
        community::cancel_update_authority(ctx)
    }

    pub fn verify_profile_for_community(
        ctx: Context<VerifyProfileForCommunity>,
        args: VerifyProfileForCommunityArgs,
    ) -> Result<()> {
        community::verify_community_profile(ctx, args)
    }
}
