import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { PublicKey } from '@solana/web3.js'
import { convertPubKeyCommunitiesToMap, PubKeyCommunityMap } from './convert-to-map'
import { createDevCommunity } from './index'

export const pubkeyPda = new PublicKey('PubkntyGPcm1D7WHjzwiFUpfiRvBKd4YLRYuWwrWgC2')
export const losPda = new PublicKey('LoS3cYypPHqCJQqv33z8FhxUFUmGwmPS8xkjX1UceQ4')
export const pubKey: PubKeyCommunity = createDevCommunity({
  name: 'PubKey',
  publicKey: pubkeyPda,
  avatarUrl: 'https://avatars.githubusercontent.com/u/125477168?v=4',
})
export const legendsOfSol: PubKeyCommunity = createDevCommunity({
  publicKey: losPda,
  name: 'Legends Of Sol',
  avatarUrl: 'https://avatars.githubusercontent.com/u/155770719?v=4',
})

export const communities: PubKeyCommunity[] = [pubKey, legendsOfSol]

export const communityMap: PubKeyCommunityMap = convertPubKeyCommunitiesToMap(communities)
