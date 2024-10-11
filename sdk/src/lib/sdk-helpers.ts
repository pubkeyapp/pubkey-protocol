import { PubKeyCommunity, PubKeyProfile } from '@pubkey-protocol/anchor'

export function getCommunityAvatarUrl(slug: string) {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${slug}`
}

export function getProfileAvatarUrl(username: string) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`
}

export function ellipsify(str = '', len = 4, delimiter = '..') {
  const strLen = str.length
  const limit = len * 2 + delimiter.length

  return strLen >= limit ? str.substring(0, len) + delimiter + str.substring(strLen - len, strLen) : str
}

export function slugify(str: string): string {
  // Convert to lowercase
  let slug = str.toLowerCase()

  // Replace non-alphanumeric characters (except underscore) with an empty string
  slug = slug.replace(/[^a-z0-9_]/g, '')

  // Trim to max length of 20 characters
  if (slug.length > 20) {
    slug = slug.substring(0, 20)
  }

  // Ensure minimum length of 3 characters, pad with underscores if needed
  if (slug.length < 3) {
    slug = slug.padEnd(3, '_')
  }

  return slug
}

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
