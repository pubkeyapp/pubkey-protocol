import { IdentityProvider } from '@pubkey-protocol/anchor'
import { CommunityCreateOptions, CommunityUpdateOptions, getExplorerUrl } from '@pubkey-protocol/sdk'
import { getConfig } from '../utils/get-config'
import { createOrGetConfig } from './create-or-get-config'
import { ProvisionSampleDataOptions } from './provision-sample-data'
import { sleep } from './sleep'

type ProvisionCommunityCreate = Omit<CommunityCreateOptions, 'authority' | 'communityAuthority'>
type ProvisionCommunityUpdate = Omit<CommunityUpdateOptions, 'authority' | 'feePayer' | 'slug'>

export interface CommunityMapItem {
  create: ProvisionCommunityCreate
  providers?: IdentityProvider[]
  signers?: string[]
  update?: ProvisionCommunityUpdate
}
export type CommunityProvisionMap = Record<string, CommunityMapItem>

export const communityProvisionMap: CommunityProvisionMap = {
  pubkey: {
    create: {
      name: 'PubKey',
      slug: 'pubkey',
      avatarUrl: 'https://github.com/pubkeyapp.png',
    },
    update: {
      discord: 'https://discord.gg/XxuZQeDPNf',
      github: 'https://github.com/pubkeyapp',
      farcaster: 'https://warpcast.com/pubkey',
      website: 'https://pubkey.app',
      x: 'https://x.com/pubkeyapp',
    },
    providers: [IdentityProvider.Discord, IdentityProvider.Github, IdentityProvider.X],
    signers: [
      'PKNW4GoGFQQvwfq6MmmBxHm7tGRMcWKxpUubAeJ4Zuu',
      'Link6EYLf3dWBwvJjFzUZFFi48cGtaNRr5vhMW1JbEh',
      'PPLAPR9qXjkQ8QhY7nBXgsEDXVnZ4VBghzNXfnmT4Uw',
    ],
  },
  los: {
    create: {
      name: 'Legends of SOL',
      slug: 'los',
      avatarUrl: 'https://github.com/legends-of-sol.png',
    },
    update: {
      discord: 'https://discord.gg/kQb7YQYePS',
      github: 'https://github.com/legends-of-sol',
      website: 'https://legendsofsol.com',
      x: 'https://x.com/Legends_of_SOL',
    },
    providers: [IdentityProvider.Discord, IdentityProvider.Github, IdentityProvider.X],
    signers: ['PPLAPR9qXjkQ8QhY7nBXgsEDXVnZ4VBghzNXfnmT4Uw'],
  },
  deanslist: {
    create: {
      name: `Dean's List`,
      slug: 'deanslist',
      avatarUrl: 'https://github.com/dean-s-list.png',
    },
    update: {
      discord: 'https://discord.gg/deanslist',
      github: 'https://github.com/dean-s-list',
      website: 'https://deanslist.services',
      x: 'https://x.com/deanslistDAO',
    },
    providers: [IdentityProvider.Discord, IdentityProvider.Github],
    signers: ['PPLAPR9qXjkQ8QhY7nBXgsEDXVnZ4VBghzNXfnmT4Uw'],
  },
  gibwork: {
    create: {
      name: `Gib Work`,
      slug: 'gibwork',
      avatarUrl: 'https://github.com/gibwork.png',
    },
    update: {
      discord: 'https://discord.gg/G54VHkcuHS',
      github: 'https://github.com/gibwork',
      website: 'https://gib.work',
      telegram: 'https://t.me/gib_work',
      x: 'https://x.com/gib_work',
    },
    providers: [IdentityProvider.Discord, IdentityProvider.Github, IdentityProvider.X],
    signers: ['PPLAPR9qXjkQ8QhY7nBXgsEDXVnZ4VBghzNXfnmT4Uw'],
  },
  marinade: {
    create: {
      name: 'Marinade',
      slug: 'marinade',
      avatarUrl: 'https://github.com/marinade-finance.png',
    },
    update: {
      discord: 'https://discord.gg/yTdH8YkYKg',
      github: 'https://github.com/marinade-finance',
      website: 'https://marinade.finance',
      x: 'https://x.com/MarinadeFinance',
    },
    providers: [IdentityProvider.Discord],
    signers: ['PPLAPR9qXjkQ8QhY7nBXgsEDXVnZ4VBghzNXfnmT4Uw'],
  },
}

export async function provisionSampleDataCommunities(options: ProvisionSampleDataOptions) {
  const { authority, connection, endpoint, cluster, sdk } = await getConfig()
  console.log(` -> Authority Account: ${authority.publicKey.toString()}`)
  const { config } = await createOrGetConfig()
  console.log(` -> Config Account: ${config.publicKey.toString()}`)

  const existing = await sdk.communityGetAll()
  const existingNames = existing.map((c) => c.name)
  console.log(` -> Found ${existing.length} communities`, existingNames.join(', '))

  const communitiesCreate = Object.keys(communityProvisionMap).map((slug) => communityProvisionMap[slug].create)

  for (const { avatarUrl, name, slug } of communitiesCreate.filter((c) => !existingNames.includes(c.name))) {
    console.log(` -> Creating community: ${name}`)
    const { input, tx: transaction } = await sdk.communityCreate({
      authority: authority.publicKey,
      communityAuthority: authority.publicKey,
      avatarUrl,
      name,
      slug,
    })
    transaction.sign([authority])
    if (options.dryRun) {
      console.log(` -> Dry run, skipping create community: ${name} ${input.slug}`)
      continue
    }
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(` -> Created community: ${name} ${input.slug}`, s)
    console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    await sleep(options.timeout)
  }

  const communitiesUpdate = Object.keys(communityProvisionMap)
    .filter((slug) => Object.keys(communityProvisionMap[slug].update ?? {}).length > 0)
    .map((slug) => ({ ...communityProvisionMap[slug].update, slug }))

  for (const input of communitiesUpdate) {
    console.log(` -> Updating community: ${input.slug}`)
    const { tx: transaction } = await sdk.communityUpdate({
      ...input,
      authority: authority.publicKey,
      feePayer: authority.publicKey,
    })
    transaction.sign([authority])
    if (options.dryRun) {
      console.log(` -> Dry run, skipping update community: ${input.slug}`)
      continue
    }
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(` -> Updated community: ${input.slug}`, s)
    console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    await sleep(options.timeout)
  }

  const communitiesSignerAdd = Object.keys(communityProvisionMap)
    .filter((slug) => Object.keys(communityProvisionMap[slug].signers ?? []).length > 0)
    .map((slug) => ({ signers: communityProvisionMap[slug].signers, slug }))

  for (const signers of communitiesSignerAdd) {
    for (const signer of signers.signers) {
      console.log(` -> Adding signer ${signer} to community: ${signers.slug}`)
      const { tx: transaction } = await sdk.communitySignerAdd({
        slug: signers.slug,
        signer,
        authority: authority.publicKey,
        feePayer: authority.publicKey,
      })
      transaction.sign([authority])
      if (options.dryRun) {
        console.log(` -> Dry run, skipping signer ${signer} to community: ${signers.slug}`)
        continue
      }
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(` -> Added signers to community: ${signers.slug}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
      await sleep(options.timeout)
    }
  }

  const communitiesProviderEnable = Object.keys(communityProvisionMap)
    .filter((slug) => Object.keys(communityProvisionMap[slug].providers ?? []).length > 0)
    .map((slug) => ({ providers: communityProvisionMap[slug].providers, slug }))

  for (const providers of communitiesProviderEnable) {
    for (const provider of providers.providers) {
      console.log(` -> Enabling provider ${provider} for community: ${providers.slug}`)
      const { tx: transaction } = await sdk.communityProviderEnable({
        slug: providers.slug,
        provider,
        authority: authority.publicKey,
        feePayer: authority.publicKey,
      })
      transaction.sign([authority])
      if (options.dryRun) {
        console.log(` -> Dry run, skipping provider ${provider} for community: ${providers.slug}`)
        continue
      }
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(` -> Enabled provider ${provider} for community: ${providers.slug}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
      await sleep(options.timeout)
    }
  }
}
