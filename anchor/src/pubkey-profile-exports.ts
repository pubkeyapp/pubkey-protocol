// Here we export some useful types and functions for interacting with the Anchor program.
import { sha256 } from '@noble/hashes/sha256'
import { Cluster, PublicKey } from '@solana/web3.js'
import type { PubkeyProfile } from '../target/types/pubkey_profile'
import { IDL as PubkeyProfileIDL } from '../target/types/pubkey_profile'

// Re-export the generated IDL and type
export { PubkeyProfile, PubkeyProfileIDL }

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const PUBKEY_PROFILE_PROGRAM_ID = new PublicKey('PPLxLRPKPFvjKf3Xe48gXxispUXAuGb8GgkzG9aJetB')

// This is a helper function to get the program ID for the PubkeyProfile program depending on the cluster.
export function getPubkeyProfileProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return PUBKEY_PROFILE_PROGRAM_ID
  }
}

// Here we define the seeds and prefixes for the PubkeyProfile program.
export const PUBKEY_PROFILE_PREFIX = new TextEncoder().encode('pubkey_profile')
export const PUBKEY_PROFILE_SEED_PROFILE = new TextEncoder().encode('profile')
export const PUBKEY_PROFILE_SEED_POINTER = new TextEncoder().encode('pointer')

// Helper method to get the PubKeyProfile PDA
export function getPubKeyProfilePda({ programId, username }: { programId: PublicKey; username: string }) {
  return PublicKey.findProgramAddressSync(
    [PUBKEY_PROFILE_PREFIX, PUBKEY_PROFILE_SEED_PROFILE, stringToUint8Array(username)],
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
  provider: PubKeyIdentityProvider
  providerId: string
}) {
  const hash = sha256(
    Uint8Array.from([
      ...PUBKEY_PROFILE_PREFIX,
      ...PUBKEY_PROFILE_SEED_POINTER,
      ...stringToUint8Array(provider),
      ...stringToUint8Array(providerId),
    ]),
  )

  return PublicKey.findProgramAddressSync([hash], programId)
}

export enum PubKeyIdentityProvider {
  Discord = 'Discord',
  Solana = 'Solana',
}

export interface PubKeyProfile {
  authorities: string[]
  avatarUrl: string
  identities: PubKeyIdentity[]
  username: string
}

export interface PubKeyIdentity {
  name: string
  provider: PubKeyIdentityProvider
  providerId: string
}

export function stringToUint8Array(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}
