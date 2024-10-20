// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { sha256 } from '@noble/hashes/sha256'
import { Cluster, PublicKey } from '@solana/web3.js'
import PubkeyProtocolIDL from '../target/idl/pubkey_protocol.json'
import type { PubkeyProtocol } from '../target/types/pubkey_protocol'

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

// Helper method to get the Community PDA
export function getPubKeyCommunityPda({ programId, slug }: { programId: PublicKey; slug: string }) {
  return PublicKey.findProgramAddressSync(
    [PUBKEY_PROTOCOL_PREFIX, PUBKEY_PROTOCOL_SEED_COMMUNITY, stringToUint8Array(slug)],
    programId,
  )
}

// Helper method to get the Config PDA
export function getPubKeyConfigPda({ programId }: { programId: PublicKey }) {
  return PublicKey.findProgramAddressSync([PUBKEY_PROTOCOL_PREFIX, PUBKEY_PROTOCOL_SEED_CONFIG], programId)
}

// Helper method to get the PubKeyProfile PDA
export function getPubKeyProfilePda({ programId, username }: { programId: PublicKey; username: string }) {
  return PublicKey.findProgramAddressSync(
    [PUBKEY_PROTOCOL_PREFIX, PUBKEY_PROTOCOL_SEED_PROFILE, stringToUint8Array(username)],
    programId,
  )
}

// Helper method to get the PubKeyPointer PDA
export function getPubKeyPointerPda({
  programId,
  provider,
  providerId,
}: {
  programId: PublicKey
  provider: IdentityProvider
  providerId: string
}) {
  const hash = sha256(
    Uint8Array.from([
      ...PUBKEY_PROTOCOL_PREFIX,
      ...PUBKEY_PROTOCOL_SEED_POINTER,
      ...stringToUint8Array(provider),
      ...stringToUint8Array(providerId),
    ]),
  )

  return PublicKey.findProgramAddressSync([hash], programId)
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
  publicKey: PublicKey
  authorities: PublicKey[]
  avatarUrl: string
  feePayer?: PublicKey
  bump?: number
  identities: PubKeyIdentity[]
  name: string
  username: string
}

export interface PubKeyIdentity {
  name: string
  provider: IdentityProvider
  providerId: string
  communities?: PublicKey[]
}

export interface PubKeyPointer {
  publicKey: PublicKey
  provider: IdentityProvider
  providerId: string
  bump?: number
  profile: PublicKey
}

export interface PubKeyConfig {
  publicKey: PublicKey
  bump: number
  communityAuthority: PublicKey
  configAuthority: PublicKey
}

export interface PubKeyCommunity {
  authority: PublicKey
  avatarUrl: string
  bump: number
  discord?: string
  farcaster?: string
  github?: string
  name: string
  pendingAuthority: PublicKey | null
  providers: IdentityProvider[]
  publicKey: PublicKey
  signers: PublicKey[]
  slug: string
  telegram?: string
  website?: string
  x?: string
}

export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}
