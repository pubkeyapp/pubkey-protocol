import { AnchorProvider } from '@coral-xyz/anchor'
import { IdentityProvider, PublicKeyString } from '@pubkey-protocol/anchor'
import { Connection, TransactionInstruction } from '@solana/web3.js'

export interface CreateTransactionOptions {
  feePayer: PublicKeyString
  ix: TransactionInstruction | TransactionInstruction[]
}

export interface CommunityAuthorityApproveOptions {
  feePayer: PublicKeyString
  newAuthority: PublicKeyString
  slug: string
}

export interface CommunityAuthorityDecline {
  authority: PublicKeyString
  feePayer: PublicKeyString
  slug: string
}

export interface CommunityAuthorityRequest {
  slug: string
  newAuthority: PublicKeyString
  authority: PublicKeyString
  feePayer: PublicKeyString
}

export interface CommunityGet {
  community: PublicKeyString
  nullable?: boolean
}

export interface CommunityCreateInput {
  avatarUrl: string
  name: string
  slug: string
}

export interface CommunityCreateOptions {
  communityAuthority: PublicKeyString
  authority: PublicKeyString
  avatarUrl?: string
  name: string
  slug?: string
}

export interface CommunityUpdateOptions {
  authority: PublicKeyString
  avatarUrl?: string
  discord?: string
  farcaster?: string
  feePayer: PublicKeyString
  github?: string
  name?: string
  slug: string
  telegram?: string
  website?: string
  x?: string
}

export interface ConfigGet {
  config: PublicKeyString
  nullable?: boolean
}

export interface PointerGet {
  nullable?: boolean
  pointer: PublicKeyString
}

export interface ProfileAuthorityAddOptions {
  authority: PublicKeyString
  community: PublicKeyString
  feePayer: PublicKeyString
  newAuthority: PublicKeyString
  username: string
}

export interface ProfileAuthorityRemoveOptions {
  authority: PublicKeyString
  authorityToRemove: PublicKeyString
  community: PublicKeyString
  feePayer: PublicKeyString
  username: string
}

export interface ProfileCreateOptions {
  avatarUrl?: string
  authority: PublicKeyString
  community: PublicKeyString
  feePayer: PublicKeyString
  name: string
  username?: string
}

export interface ProfileGet {
  nullable?: boolean
  profile: PublicKeyString
}

export interface ProfileGetByProvider {
  nullable?: boolean
  provider: IdentityProvider
  providerId: string
}

export interface ProfileIdentityAddOptions {
  authority: PublicKeyString
  community: PublicKeyString
  feePayer: PublicKeyString
  name: string
  provider: IdentityProvider
  providerId: string
  username: string
}

export interface ProfileIdentityRemoveOptions {
  authority: PublicKeyString
  community: PublicKeyString
  feePayer: PublicKeyString
  username: string
  providerId: string
  provider: IdentityProvider
}

export interface ProfileIdentityVerifyOptions {
  authority: PublicKeyString
  community: PublicKeyString
  feePayer: PublicKeyString
  username: string
  providerId: string
  provider: IdentityProvider
}

export interface ProfileUpdateOptions {
  avatarUrl: string
  authority: PublicKeyString
  community: PublicKeyString
  feePayer: PublicKeyString
  name: string
  username: string
}

export interface PubKeyProfileSdkOptions {
  readonly connection: Connection
  readonly programId?: PublicKeyString
  readonly provider: AnchorProvider
}
