import { PubKeyProfile } from '@pubkey-protocol/sdk'

export type PubKeyProfileMap = Record<string, PubKeyProfile>

export function convertPubKeyProfilesToMap(profiles: PubKeyProfile[]): PubKeyProfileMap {
  return profiles.reduce(
    (map, profile) => ({ ...map, [profile.publicKey.toString()]: profile }),
    {} as PubKeyProfileMap,
  )
}
