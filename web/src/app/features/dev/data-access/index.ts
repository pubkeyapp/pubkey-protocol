import {
  ellipsify,
  getAvatarUrlCommunity,
  getAvatarUrlProfile,
  IdentityProvider,
  PubKeyCommunity,
  PubKeyIdentity,
  PubKeyProfile,
  PublicKeyString,
  slugify,
} from '@pubkey-protocol/sdk'
import { PublicKey } from '@solana/web3.js'

export function createDevCommunity({
  avatarUrl,
  name,
  publicKey,
}: {
  avatarUrl?: string
  name: string
  publicKey: PublicKeyString
}): PubKeyCommunity {
  const slug = slugify(name)

  return {
    authority: PublicKey.default,
    avatarUrl: avatarUrl ?? getAvatarUrlCommunity(slug),
    bump: 0,
    discord: undefined,
    signers: [],
    github: undefined,
    pendingAuthority: PublicKey.default,
    providers: [
      IdentityProvider.Discord,
      IdentityProvider.Farcaster,
      IdentityProvider.Github,
      IdentityProvider.Google,
      IdentityProvider.Solana,
      IdentityProvider.Telegram,
      IdentityProvider.X,
    ],
    publicKey,
    slug,
    x: undefined,
    name,
  }
}

export function createDevProfile({
  identities,
  publicKey,
  name,
  ...props
}: {
  identities: PubKeyIdentity[]
  name: string
  publicKey: PublicKeyString
  username?: string
  bio?: string
}): PubKeyProfile {
  const username = props.username ?? slugify(name)
  const avatarUrl = getAvatarUrlProfile(username)

  return {
    bump: 0,
    identities,
    publicKey,
    name,
    username,
    authorities: [],
    avatarUrl,
    bio: props.bio ?? null,
  }
}

export function createDevIdentity({
  communities,
  provider,
  providerId,
  name,
}: {
  communities: PublicKeyString[]
  provider: IdentityProvider
  providerId: string
  name?: string
}): PubKeyIdentity {
  return {
    provider,
    providerId,
    name: name ?? ellipsify(providerId, 6),
    communities,
  }
}

export function createDevIdentityDiscord({
  communities,
  name,
  providerId,
}: {
  communities: PublicKeyString[]
  name?: string
  providerId: string
}): PubKeyIdentity {
  return createDevIdentity({ communities, provider: IdentityProvider.Discord, providerId, name })
}
export function createDevIdentityFarcaster({
  communities,
  name,
  providerId,
}: {
  communities: PublicKeyString[]
  name?: string
  providerId: string
}): PubKeyIdentity {
  return createDevIdentity({ communities, provider: IdentityProvider.Farcaster, providerId, name })
}
export function createDevIdentityGithub({
  communities,
  name,
  providerId,
}: {
  communities: PublicKeyString[]
  name?: string
  providerId: string
}): PubKeyIdentity {
  return createDevIdentity({ communities, provider: IdentityProvider.Github, providerId, name })
}
export function createDevIdentityGoogle({
  communities,
  name,
  providerId,
}: {
  communities: PublicKeyString[]
  name?: string
  providerId: string
}): PubKeyIdentity {
  return createDevIdentity({ communities, provider: IdentityProvider.Google, providerId, name })
}
export function createDevIdentitySolana({
  communities,
  name,
  providerId,
}: {
  communities: PublicKeyString[]
  name?: string
  providerId: string
}): PubKeyIdentity {
  return createDevIdentity({ communities, provider: IdentityProvider.Solana, providerId, name })
}
export function createDevIdentityTelegram({
  communities,
  name,
  providerId,
}: {
  communities: PublicKeyString[]
  name?: string
  providerId: string
}): PubKeyIdentity {
  return createDevIdentity({ communities, provider: IdentityProvider.Telegram, providerId, name })
}
export function createDevIdentityX({
  communities,
  name,
  providerId,
}: {
  communities: PublicKeyString[]
  name?: string
  providerId: string
}): PubKeyIdentity {
  return createDevIdentity({ communities, provider: IdentityProvider.X, providerId, name })
}
