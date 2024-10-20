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
    pub fn profile_authority_add(
        ctx: Context<ProfileAuthorityAdd>,
        args: ProfileAuthorityAddArgs,
    ) -> Result<()> {
        profile::profile_authority_add(ctx, args)
    }

    pub fn profile_authority_remove(
        ctx: Context<ProfileAuthorityRemove>,
        args: ProfileAuthorityRemoveArgs,
    ) -> Result<()> {
        profile::profile_authority_remove(ctx, args)
    }

    pub fn profile_create(ctx: Context<ProfileCreate>, args: ProfileCreateArgs) -> Result<()> {
        profile::profile_create(ctx, args)
    }

    pub fn profile_update_details(
        ctx: Context<UpdateProfileDetails>,
        args: UpdateProfileDetailsArgs,
    ) -> Result<()> {
        profile::profile_update_details(ctx, args)
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
    pub fn community_signer_add(
        ctx: Context<CommunitySignerAdd>,
        args: CommunitySignerAddArgs,
    ) -> Result<()> {
        community::community_signer_add(ctx, args)
    }

    pub fn community_signer_remove(
        ctx: Context<CommunitySignerRemove>,
        args: CommunitySignerRemoveArgs,
    ) -> Result<()> {
        community::community_signer_remove(ctx, args)
    }

    pub fn community_update_authority_approve(
        ctx: Context<CommunityUpdateAuthorityApprove>,
    ) -> Result<()> {
        community::community_update_authority_approve(ctx)
    }

    pub fn community_update_authority_decline(
        ctx: Context<CommunityUpdateAuthorityDecline>,
    ) -> Result<()> {
        community::community_update_authority_decline(ctx)
    }

    pub fn community_update_authority_request(
        ctx: Context<CommunityUpdateAuthorityRequest>,
        args: CommunityUpdateAuthorityRequestArgs,
    ) -> Result<()> {
        community::community_update_authority_request(ctx, args)
    }

    pub fn community_update_details(
        ctx: Context<UpdateCommunityDetails>,
        args: UpdateCommunityDetailsArgs,
    ) -> Result<()> {
        community::community_update_details(ctx, args)
    }

    pub fn config_init(ctx: Context<ConfigInit>, args: ConfigInitArgs) -> Result<()> {
        config::config_init(ctx, args)
    }

    pub fn verify_profile_identity(
        ctx: Context<VerifyProfileIdentity>,
        args: VerifyProfileIdentityArgs,
    ) -> Result<()> {
        community::verify_profile_identity(ctx, args)
    }
}
