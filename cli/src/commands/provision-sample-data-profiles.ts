import { IdentityProvider } from '@pubkey-protocol/anchor'
import {
  getExplorerUrl,
  getKeypairFromByteArray,
  ProfileCreateOptions,
  ProfileIdentityAddOptions,
  ProfileIdentityVerifyOptions,
  ProfileUpdateOptions,
} from '@pubkey-protocol/sdk'
import { getConfig } from '../utils/get-config'
import { createOrGetConfig } from './create-or-get-config'
import { ProvisionSampleDataOptions } from './provision-sample-data'
import { sleep } from './sleep'

type ProvisionProfileCreate = Omit<ProfileCreateOptions, 'authority' | 'community' | 'feePayer'>
type ProvisionProfileIdentityAdd = Omit<ProfileIdentityAddOptions, 'authority' | 'community' | 'feePayer' | 'username'>
type ProvisionProfileIdentityVerify = Omit<
  ProfileIdentityVerifyOptions,
  'authority' | 'community' | 'feePayer' | 'username'
> & { community: string }
type ProvisionProfileUpdate = Omit<ProfileUpdateOptions, 'authority' | 'community' | 'feePayer' | 'username'>

interface ProfileAuthority {
  publicKey: string
  secretKey: number[]
}

export interface ProfileMapItem {
  authority: ProfileAuthority
  create: ProvisionProfileCreate
  identities?: ProvisionProfileIdentityAdd[]
  update?: ProvisionProfileUpdate
  verifications?: ProvisionProfileIdentityVerify[]
}
export type ProfileProvisionMap = Record<string, ProfileMapItem>

export const profileProvisionMap: ProfileProvisionMap = {
  alice: {
    authority: {
      publicKey: 'ALiC98dw6j47Skrxje3zBN4jTA11w67JRjQRBeZH3BRG',
      // prettier-ignore
      secretKey: [255,215,204,225,169,184,158,202,63,124,6,32,255,73,197,125,12,70,179,193,91,206,85,228,147,220,204,93,65,189,3,106,138,197,203,50,45,58,90,237,111,155,255,101,3,133,100,108,254,35,33,104,61,195,80,87,59,0,12,214,219,248,248,119],
    },
    create: {
      name: 'Alice',
      avatarUrl: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=alice`,
    },
    update: {
      bio: "Alice's updated bio",
    },
    identities: [
      { provider: IdentityProvider.Github, providerId: '123123', name: 'pubkey_alice' },
      { provider: IdentityProvider.Discord, providerId: '123123', name: 'pubkey_alice' },
    ],
    verifications: [
      ...['los', 'deanslist', 'gibwork']
        .map((community) => [
          { provider: IdentityProvider.Discord, providerId: '123123', community },
          { provider: IdentityProvider.Github, providerId: '123123', community },
          {
            provider: IdentityProvider.Solana,
            providerId: 'ALiC98dw6j47Skrxje3zBN4jTA11w67JRjQRBeZH3BRG',
            community,
          },
        ])
        .flat(),
    ],
  },
  bob: {
    authority: {
      publicKey: 'BoBigKFEgt5izFVmpZAqnHDjNXNMYFbYrbiXy4EkfJDE',
      // prettier-ignore
      secretKey: [128,142,119,244,20,49,23,145,238,13,193,26,71,165,89,226,25,171,202,165,144,39,90,17,83,77,7,164,224,94,142,15,160,105,180,189,217,106,163,191,141,114,251,233,166,37,119,227,38,189,239,9,91,210,59,165,175,167,158,98,105,74,149,169],
    },
    create: {
      name: 'Bob',
      avatarUrl: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=bob`,
    },
    update: {
      bio: "Bob's updated bio",
    },
    identities: [
      { provider: IdentityProvider.Discord, providerId: '456456', name: 'pubkey_bob' },
      { provider: IdentityProvider.Github, providerId: '456456', name: 'pubkey_bob' },
    ],
    verifications: [
      { provider: IdentityProvider.Discord, providerId: '456456', community: 'gibwork' },
      { provider: IdentityProvider.Github, providerId: '456456', community: 'gibwork' },
      {
        provider: IdentityProvider.Solana,
        providerId: 'BoBigKFEgt5izFVmpZAqnHDjNXNMYFbYrbiXy4EkfJDE',
        community: 'gibwork',
      },
    ],
  },
}

export async function provisionSampleDataProfiles(options: ProvisionSampleDataOptions) {
  const { authority: communityAuthority, connection, endpoint, cluster, sdk } = await getConfig()
  console.log(` -> Authority Account: ${communityAuthority.publicKey.toString()}`)
  const { config } = await createOrGetConfig()
  console.log(` -> Config Account: ${config.publicKey.toString()}`)

  const defaultCommunity = await sdk.communityGet({ community: 'pubkey' })

  const existing = await sdk.profileGetAll()
  const existingNames = existing.map((c) => c.name)
  console.log(` -> Found ${existing.length} profiles`, existingNames.join(', '))

  const profilesCreate = Object.keys(profileProvisionMap).map((username) => ({
    ...profileProvisionMap[username].create,
    username,
  }))

  for (const { avatarUrl, name, username } of profilesCreate.filter((c) => !existingNames.includes(c.name))) {
    const authority = getKeypairFromByteArray(profileProvisionMap[username].authority.secretKey)

    const { input, tx: transaction } = await sdk.profileCreate({
      authority: authority.publicKey,
      feePayer: communityAuthority.publicKey,
      community: defaultCommunity.publicKey,
      avatarUrl,
      name,
      username,
    })
    transaction.sign([communityAuthority, authority])
    if (options.dryRun) {
      console.log(` -> Dry run, skipping create profile: ${name} ${input.username}`)
      return
    }
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(` -> Created profile: ${name} ${input.username}`, s)
    console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    await sleep(options.timeout)
  }

  const profilesUpdate = Object.keys(profileProvisionMap)
    .filter((username) => Object.keys(profileProvisionMap[username].update ?? {}).length > 0)
    .map((username) => ({ update: profileProvisionMap[username].update, username }))

  for (const { update, username } of profilesUpdate) {
    const authority = getKeypairFromByteArray(profileProvisionMap[username].authority.secretKey)

    const transaction = await sdk.profileUpdate({
      authority: authority.publicKey,
      community: defaultCommunity.publicKey,
      feePayer: communityAuthority.publicKey,
      username,
      ...update,
    })
    transaction.sign([communityAuthority, authority])
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(` -> Updated profile: ${username}`, s)
    console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    await sleep(options.timeout)
  }

  const profilesIdentitiesAdd = Object.keys(profileProvisionMap)
    .filter((username) => Object.keys(profileProvisionMap[username].identities ?? []).length > 0)
    .map((username) => ({ identities: profileProvisionMap[username].identities, username }))

  for (const { identities, username } of profilesIdentitiesAdd) {
    const authority = getKeypairFromByteArray(profileProvisionMap[username].authority.secretKey)
    for (const identity of identities) {
      const transaction = await sdk.profileIdentityAdd({
        authority: authority.publicKey,
        community: defaultCommunity.publicKey,
        feePayer: communityAuthority.publicKey,
        name: identity.name,
        provider: identity.provider,
        providerId: identity.providerId,
        username,
      })
      transaction.sign([communityAuthority, authority])
      if (options.dryRun) {
        console.log(
          ` -> Dry run, skipping identity ${identity.provider} ${identity.providerId} to profile: ${username}`,
        )
        continue
      }
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(` -> Added identity to profile: ${username}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
      await sleep(options.timeout)
    }
  }

  const profilesIdentitiesVerify = Object.keys(profileProvisionMap)
    .filter((username) => Object.keys(profileProvisionMap[username].verifications ?? []).length > 0)
    .map((username) => ({ verifications: profileProvisionMap[username].verifications, username }))

  for (const { verifications, username } of profilesIdentitiesVerify) {
    for (const verification of verifications) {
      const community = await sdk.communityGet({ community: verification.community })
      const transaction = await sdk.profileIdentityVerify({
        authority: communityAuthority.publicKey,
        community: community.publicKey,
        feePayer: communityAuthority.publicKey,
        provider: verification.provider,
        providerId: verification.providerId,
        username,
      })
      transaction.sign([communityAuthority])
      if (options.dryRun) {
        console.log(
          ` -> Dry run, skipping verify ${verification.community} ${verification.provider} ${verification.providerId} to profile: ${username}`,
        )
        continue
      }
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(` -> ${verification.community} Verified ${verification.provider} identity to profile: ${username}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
      await sleep(options.timeout)
    }
  }
}
