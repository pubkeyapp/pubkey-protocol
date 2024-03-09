export interface PubKeyProfile {
  username: string
  avatarUrl: string
  identities: PubKeyIdentity[]
  owners: string[]
}

export interface PubKeyIdentity {
  provider: PubKeyIdentityProvider
  providerId: string
  name: string
}

export enum PubKeyIdentityProvider {
  Discord = 'Discord',
  Solana = 'Solana',
}

export const sampleBeeman: PubKeyProfile = {
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
  owners: ['BeEMuaaQCQPodQdaA7W6Rmsu7761vCabN4Tth6jA4VCP'],
}

export const sampleSundeep: PubKeyProfile = {
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
  owners: ['81sWMLg1EgYps3nMwyeSW1JfjKgFqkGYPP85vTnkFzRn'],
}

export const sampleProfiles: PubKeyProfile[] = [sampleBeeman, sampleSundeep]
