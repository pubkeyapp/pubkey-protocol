// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { PubkeyProfile } from '../target/types/pubkey_profile';
import { IDL as PubkeyProfileIDL } from '../target/types/pubkey_profile';

// Re-export the generated IDL and type
export { PubkeyProfile, PubkeyProfileIDL };

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
