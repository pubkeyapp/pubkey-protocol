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

  // Community Actions
    pub fn community_authority_approve(ctx: Context<CommunityAuthorityApprove>) -> Result<()> {
        community::community_authority_approve(ctx)
    }

    pub fn community_authority_decline(ctx: Context<CommunityAuthorityDecline>) -> Result<()> {
        community::community_authority_decline(ctx)
    }

    pub fn community_authority_request(
        ctx: Context<CommunityAuthorityRequest>,
        args: CommunityAuthorityRequestArgs,
    ) -> Result<()> {
        community::community_authority_request(ctx, args)
    }

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

    pub fn community_update(
        ctx: Context<CommunityUpdate>,
        args: CommunityUpdateArgs,
    ) -> Result<()> {
        community::community_update(ctx, args)
    }

    pub fn config_init(ctx: Context<ConfigInit>, args: ConfigInitArgs) -> Result<()> {
        config::config_init(ctx, args)
    }

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

    pub fn profile_identity_add(
        ctx: Context<ProfileIdentityAdd>,
        args: ProfileIdentityAddArgs,
    ) -> Result<()> {
        profile::profile_identity_add(ctx, args)
    }

    pub fn profile_identity_remove(
        ctx: Context<ProfileIdentityRemove>,
        args: ProfileIdentityRemoveArgs,
    ) -> Result<()> {
        profile::profile_identity_remove(ctx, args)
    }

    pub fn profile_identity_verify(
        ctx: Context<ProfileIdentityVerify>,
        args: ProfileIdentityVerifyArgs,
    ) -> Result<()> {
        profile::profile_identity_verify(ctx, args)
    }

    pub fn profile_update(ctx: Context<ProfileUpdate>, args: ProfileUpdateArgs) -> Result<()> {
        profile::profile_update(ctx, args)
    }

}
