pub fn is_valid_url(url: &str) -> bool {
    let starts_with_http = url.starts_with("http://") || url.starts_with("https://");

    let has_valid_protocol_format = url.matches("://").count() == 1 && !url.contains(":///");

    let after_protocol = url.split("://").nth(1).unwrap_or("");
    let has_content_after_protocol = !after_protocol.is_empty() && after_protocol != "/";

    let dot_parts = url.split('.').collect::<Vec<&str>>();
    let is_ipv6 = url.contains("[::1]") || url.contains("[") && url.contains("]");

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
