import { IdentityProvider } from '@pubkey-protocol/anchor'
import { CommunityCreateOptions, CommunityUpdateOptions, getExplorerUrl } from '@pubkey-protocol/sdk'
import { getConfig } from '../utils/get-config'
import { createOrGetConfig } from './create-or-get-config'

type ProvisionCommunityCreate = Omit<CommunityCreateOptions, 'authority' | 'communityAuthority'>
type ProvisionCommunityUpdate = Omit<CommunityUpdateOptions, 'authority' | 'feePayer' | 'slug'>

interface MapItem {
  create: ProvisionCommunityCreate
  providers?: IdentityProvider[]
  signers?: string[]
  update?: ProvisionCommunityUpdate
}
type ProvisionMap = Record<string, MapItem>

const provisionMap: ProvisionMap = {
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
      'PPLAPR9qXjkQ8QhY7nBXgsEDXVnZ4VBghzNXfnmT4Uw',
      'Dd1JSwojUsptwFa97A3WRZU1SijCWYo9Qa3xLxT8yzb7',
      'BumrJWH5kf4MXZ5bEg7VyZY6oXAMr78jXC1mFiDAE3u3',
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
    providers: [IdentityProvider.Discord],
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

export async function provisionCommunitiesIfNeeded() {
  const { authority, connection, endpoint, cluster, sdk } = await getConfig()
  console.log(` -> Authority Account: ${authority.publicKey.toString()}`)
  const { config } = await createOrGetConfig()
  console.log(` -> Config Account: ${config.publicKey.toString()}`)

  const existing = await sdk.communityGetAll()
  const existingNames = existing.map((c) => c.name)
  console.log(` -> Found ${existing.length} communities`, existingNames.join(', '))

  const communitiesMap = Object.keys(provisionMap)
    .filter((slug) => !existingNames.includes(slug))
    .reduce((map, slug) => ({ ...map, [slug]: provisionMap[slug] }), {} as ProvisionMap)

  console.log('communitiesMap', communitiesMap)

  const communitiesCreate = Object.keys(provisionMap).map((slug) => provisionMap[slug].create)

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
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(` -> Created community: ${name} ${input.slug}`, s)
    console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
  }

  const communitiesUpdate = Object.keys(provisionMap)
    .filter((slug) => Object.keys(provisionMap[slug].update ?? {}).length > 0)
    .map((slug) => ({ ...provisionMap[slug].update, slug }))

  for (const input of communitiesUpdate) {
    console.log(` -> Updating community: ${input.slug}`)
    const { tx: transaction } = await sdk.communityUpdate({
      ...input,
      authority: authority.publicKey,
      feePayer: authority.publicKey,
    })
    transaction.sign([authority])
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(` -> Updated community: ${input.slug}`, s)
    console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
  }

  const communitiesSignerAdd = Object.keys(provisionMap)
    .filter((slug) => Object.keys(provisionMap[slug].signers ?? []).length > 0)
    .map((slug) => ({ signers: provisionMap[slug].signers, slug }))

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
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(` -> Added signers to community: ${signers.slug}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    }
  }

  const communitiesProviderEnable = Object.keys(provisionMap)
    .filter((slug) => Object.keys(provisionMap[slug].providers ?? []).length > 0)
    .map((slug) => ({ providers: provisionMap[slug].providers, slug }))

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
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(` -> Enabled provider ${provider} for community: ${providers.slug}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    }
  }
}
