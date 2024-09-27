use anchor_lang::{prelude::*, system_program};

use crate::errors::*;
use crate::id;

pub fn is_valid_username(username: &str) -> bool {
    if username.len() < 3 || username.len() > 20 {
        return false;
    }

    if !username
        .chars()
        .all(|c| c.is_ascii_lowercase() || c.is_ascii_digit() || c == '_')
    {
        return false;
    }

    true
}

pub fn is_valid_name(name: &str) -> bool {
    if name.len() < 3 || name.len() > 50 {
        return false;
    }

    // TODO - may want to consider limiting against certain characters

    true
}

pub fn is_valid_url(url: &str) -> bool {
    let starts_with_http = url.starts_with("http://") || url.starts_with("https://");

    let has_valid_protocol_format = url.matches("://").count() == 1 && !url.contains(":///");

    let after_protocol = url.split("://").nth(1).unwrap_or("");
    let has_content_after_protocol = !after_protocol.is_empty() && after_protocol != "/";

    let dot_parts = url.split('.').collect::<Vec<&str>>();
    let is_ipv6 = url.contains("[::1]") || url.contains('[') && url.contains(']');

    // Simplified check for IPv6
    let has_valid_domain = dot_parts.len() >= 2
        && !dot_parts.last().unwrap_or(&"").is_empty()
        && dot_parts.iter().all(|&part| !part.is_empty());
    let has_valid_domain_or_localhost =
        (has_valid_domain && !dot_parts.contains(&"")) || url.contains("localhost") || is_ipv6;

    let no_empty_segments =
        !url.contains("..") && !after_protocol.starts_with('.') && !after_protocol.ends_with('.');
    let no_start_or_end_hyphen_in_domain =
        !url.contains("://-") && !url.contains(".-") && !url.contains("-.");

    let valid_scheme = starts_with_http && has_valid_protocol_format;
    let valid_path = has_content_after_protocol && no_empty_segments;
    let valid_domain = has_valid_domain_or_localhost && no_start_or_end_hyphen_in_domain;

    valid_scheme && valid_path && valid_domain
}

pub fn is_valid_farcaster(link: &str) -> bool {
    link.starts_with("https://warpcast.com/")
}

pub fn is_valid_discord(link: &str) -> bool {
    link.starts_with("https://discord.com/invite/") || link.starts_with("https://discord.gg/")
}

pub fn is_valid_github(link: &str) -> bool {
    link.starts_with("https://github.com/")
}

pub fn is_valid_telegram(link: &str) -> bool {
    link.starts_with("https://t.me/") || link.starts_with("https://telegram.me/")
}
pub fn is_valid_x(link: &str) -> bool {
    link.starts_with("https://twitter.com/") || link.starts_with("https://x.com/")
}

pub fn realloc_account<'a>(
    account: AccountInfo<'a>,
    new_account_size: usize,
    rent_payer: AccountInfo<'a>,
    system_program: AccountInfo<'a>,
) -> Result<()> {
    require_keys_eq!(
        *account.owner,
        id(),
        PubkeyProfileError::InvalidAccountOwner
    );

    let current_account_size = account.data.borrow().len();
    if current_account_size >= new_account_size {
        return Ok(());
    }

    let current_lamports = account.lamports();
    let rent_exempt_lamports = Rent::get()?.minimum_balance(new_account_size);

    let lmaports_diff = rent_exempt_lamports.saturating_sub(current_lamports);
    if lmaports_diff.gt(&0) {
        system_program::transfer(
            CpiContext::new(
                system_program,
                system_program::Transfer {
                    from: rent_payer,
                    to: account.clone(),
                },
            ),
            lmaports_diff,
        )?;
    }

    AccountInfo::realloc(&account, new_account_size, false)?;
    Ok(())
}
