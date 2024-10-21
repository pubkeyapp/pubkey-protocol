import { PubKeyCommunity, PubKeyProfile } from '@pubkey-protocol/anchor'

export type PubKeyCommunityMap = Record<string, PubKeyCommunity>

export function convertPubKeyCommunitiesToMap(communities: PubKeyCommunity[]): PubKeyCommunityMap {
  return communities.reduce(
    (map, community) => ({ ...map, [community.publicKey.toString()]: community }),
    {} as PubKeyCommunityMap,
  )
}

export type PubKeyProfileMap = Record<string, PubKeyProfile>

export function convertPubKeyProfilesToMap(profiles: PubKeyProfile[]): PubKeyProfileMap {
  return profiles.reduce(
    (map, profile) => ({ ...map, [profile.publicKey.toString()]: profile }),
    {} as PubKeyProfileMap,
  )
}
