// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { sha256 } from '@noble/hashes/sha256'
import { Cluster, PublicKey } from '@solana/web3.js'
import PubkeyProtocolIDL from '../target/idl/pubkey_protocol.json'
import type { PubkeyProtocol } from '../target/types/pubkey_protocol'

export type PublicKeyString = PublicKey | string

// Re-export the generated IDL and type
export { PubkeyProtocol, PubkeyProtocolIDL }

// This is a helper function to get the PubkeyProtocol Anchor program.
export function getPubkeyProtocolProgram(provider: AnchorProvider) {
  return new Program(PubkeyProtocolIDL as PubkeyProtocol, provider)
}

// The programId is imported from the program IDL.
export const PUBKEY_PROTOCOL_PROGRAM_ID = new PublicKey(PubkeyProtocolIDL.address)

// This is a helper function to get the program ID for the PubkeyProtocol program depending on the cluster.
export function getPubkeyProtocolProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return PUBKEY_PROTOCOL_PROGRAM_ID
  }
}

// Here we define the seeds and prefixes for the PubkeyProtocol program.
export const PUBKEY_PROTOCOL_PREFIX = new TextEncoder().encode('pubkey_protocol')
export const PUBKEY_PROTOCOL_SEED_COMMUNITY = new TextEncoder().encode('community')
export const PUBKEY_PROTOCOL_SEED_CONFIG = new TextEncoder().encode('config')
export const PUBKEY_PROTOCOL_SEED_POINTER = new TextEncoder().encode('pointer')
export const PUBKEY_PROTOCOL_SEED_PROFILE = new TextEncoder().encode('profile')

export interface GetPubKeyCommunityPdaOptions {
  programId: PublicKeyString
  slug: string
}

// Helper method to get the Community PDA
export function getPubKeyCommunityPda({ programId, slug }: GetPubKeyCommunityPdaOptions) {
  return PublicKey.findProgramAddressSync(
    [PUBKEY_PROTOCOL_PREFIX, PUBKEY_PROTOCOL_SEED_COMMUNITY, stringToUint8Array(slug)],
    new PublicKey(programId),
  )
}

export interface GetPubKeyConfigPdaOptions {
  programId: PublicKeyString
}

// Helper method to get the Config PDA
export function getPubKeyConfigPda({ programId }: GetPubKeyConfigPdaOptions) {
  return PublicKey.findProgramAddressSync(
    [PUBKEY_PROTOCOL_PREFIX, PUBKEY_PROTOCOL_SEED_CONFIG],
    new PublicKey(programId),
  )
}

export interface GetPubKeyProfilePdaOptions {
  programId: PublicKeyString
  username: string
}

// Helper method to get the PubKeyProfile PDA
export function getPubKeyProfilePda({ programId, username }: GetPubKeyProfilePdaOptions) {
  return PublicKey.findProgramAddressSync(
    [PUBKEY_PROTOCOL_PREFIX, PUBKEY_PROTOCOL_SEED_PROFILE, stringToUint8Array(username)],
    new PublicKey(programId),
  )
}

export interface GetPubKeyPointerPdaOptions {
  programId: PublicKeyString
  provider: IdentityProvider
  providerId: string
}

// Helper method to get the PubKeyPointer PDA
export function getPubKeyPointerPda({ programId, provider, providerId }: GetPubKeyPointerPdaOptions) {
  const hash = sha256(
    Uint8Array.from([
      ...PUBKEY_PROTOCOL_PREFIX,
      ...PUBKEY_PROTOCOL_SEED_POINTER,
      ...stringToUint8Array(provider),
      ...stringToUint8Array(providerId),
    ]),
  )

  return PublicKey.findProgramAddressSync([hash], new PublicKey(programId))
}

export enum IdentityProvider {
  Discord = 'Discord',
  Farcaster = 'Farcaster',
  Github = 'Github',
  Google = 'Google',
  Solana = 'Solana',
  Telegram = 'Telegram',
  X = 'X',
}

export const enumMap = {
  [IdentityProvider.Discord]: { discord: {} },
  [IdentityProvider.Farcaster]: { farcaster: {} },
  [IdentityProvider.Github]: { github: {} },
  [IdentityProvider.Google]: { google: {} },
  [IdentityProvider.Solana]: { solana: {} },
  [IdentityProvider.Telegram]: { telegram: {} },
  [IdentityProvider.X]: { x: {} },
} as const

export type AnchorIdentityProvider =
  | { discord: object }
  | { farcaster: object }
  | { github: object }
  | { google: object }
  | { solana: object }
  | { telegram: object }
  | { x: object }

export function convertToAnchorIdentityProvider(provider: IdentityProvider) {
  if (!enumMap[provider]) {
    throw new Error(`Unknown provider: ${provider}`)
  }
  return enumMap[provider]
}

export function convertAnchorIdentityProvider(provider: AnchorIdentityProvider): IdentityProvider {
  const key = Object.keys(provider)[0]

  const found: string | undefined = Object.keys(IdentityProvider).find((provider) => provider.toLowerCase() === key)

  if (!found) {
    throw new Error(`Unknown provider: ${key}`)
  }

  return IdentityProvider[found as keyof typeof IdentityProvider]
}

export function convertAnchorIdentityProviders(providers: AnchorIdentityProvider[]): IdentityProvider[] {
  return providers.map((p) => convertAnchorIdentityProvider(p))
}

export interface PubKeyProfile {
  authorities: PublicKeyString[]
  avatarUrl: string
  bump?: number
  identities: PubKeyIdentity[]
  name: string
  publicKey: PublicKeyString
  username: string
}

export interface PubKeyIdentity {
  communities?: PublicKeyString[]
  name: string
  provider: IdentityProvider
  providerId: string
}

export interface PubKeyPointer {
  bump?: number
  profile: PublicKeyString
  provider: IdentityProvider
  providerId: string
  publicKey: PublicKeyString
}

export interface PubKeyConfig {
  bump: number
  communityAuthority: PublicKeyString
  configAuthority: PublicKeyString
  publicKey: PublicKeyString
}

export interface PubKeyCommunity {
  authority: PublicKeyString
  avatarUrl: string
  bump: number
  discord?: string
  farcaster?: string
  github?: string
  name: string
  pendingAuthority?: PublicKeyString
  providers: IdentityProvider[]
  publicKey: PublicKeyString
  signers: PublicKeyString[]
  slug: string
  telegram?: string
  website?: string
  x?: string
}

export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}
