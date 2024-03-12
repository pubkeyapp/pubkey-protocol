import {
  getPubKeyProfilePda,
  PUBKEY_PROFILE_PROGRAM_ID,
  PubKeyIdentityProvider,
  PubKeyProfile,
} from '@pubkey-program-library/anchor'
import { PublicKey } from '@solana/web3.js'

const [beemanPda] = getPubKeyProfilePda({ programId: PUBKEY_PROFILE_PROGRAM_ID, username: 'beeman' })
const [subdeepPda] = getPubKeyProfilePda({ programId: PUBKEY_PROFILE_PROGRAM_ID, username: 'subdeep' })
export const sampleBeeman: PubKeyProfile = {
  publicKey: beemanPda,
  username: 'beeman',
  avatarUrl: 'https://avatars.githubusercontent.com/u/36491',
  identities: [
    {
      provider: PubKeyIdentityProvider.Discord,
      providerId: '386584531353862154',
      name: 'beeman.dev',
    },
    {
      provider: PubKeyIdentityProvider.Solana,
      providerId: 'BeEMuaaQCQPodQdaA7W6Rmsu7761vCabN4Tth6jA4VCP',
      name: '🥵 Wallet',
    },
  ],
  authorities: [new PublicKey('BeEMuaaQCQPodQdaA7W6Rmsu7761vCabN4Tth6jA4VCP')],
}

export const sampleSundeep: PubKeyProfile = {
  publicKey: subdeepPda,
  username: 'sundeep',
  avatarUrl: 'https://avatars.githubusercontent.com/u/32637757',
  identities: [
    {
      provider: PubKeyIdentityProvider.Discord,
      providerId: '185307556032413697',
      name: 'sundeepcharan',
    },
    {
      provider: PubKeyIdentityProvider.Solana,
      providerId: '81sWMLg1EgYps3nMwyeSW1JfjKgFqkGYPP85vTnkFzRn',
      name: '🐒 Wallet',
    },
  ],
  authorities: [new PublicKey('81sWMLg1EgYps3nMwyeSW1JfjKgFqkGYPP85vTnkFzRn')],
}

export const sampleProfiles: PubKeyProfile[] = [sampleBeeman, sampleSundeep]
