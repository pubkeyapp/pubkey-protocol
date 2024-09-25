pub const PREFIX: &[u8] = b"pubkey_protocol";

pub const COMMUNITY: &[u8] = b"community";
pub const PROFILE: &[u8] = b"profile";
pub const POINTER: &[u8] = b"pointer";

pub const MAX_USERNAME_SIZE: usize = 20;
pub const MAX_SLUG_SIZE: usize = MAX_USERNAME_SIZE;
pub const MAX_NAME_SIZE: usize = 50;
pub const MAX_URL_SIZE: usize = 100;
pub const MAX_PROVIDER_ID_SIZE: usize = 50;
pub const MAX_PROVIDER_NAME_SIZE: usize = 50;
pub const MAX_VECTOR_SIZE: u16 = u16::MAX;
