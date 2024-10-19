import { CommunityCreateOptions, getExplorerUrl } from '@pubkey-protocol/sdk'
import { getConfig } from '../utils/get-config'
import { createOrGetConfig } from './create-or-get-config'

export const provisionCommunities: Omit<CommunityCreateOptions, 'authority' | 'communityAuthority'>[] = [
  {
    name: 'PubKey',
    avatarUrl: 'https://github.com/pubkeyapp.png',
  },
  {
    name: 'Legends of SOL',
    slug: 'los',
    avatarUrl: 'https://github.com/legends-of-sol.png',
  },
  {
    name: `Dean's List`,
    slug: 'deanslist',
    avatarUrl: 'https://github.com/dean-s-list.png',
  },
  {
    name: `Gib Work`,
    slug: 'gibwork',
    avatarUrl: 'https://github.com/gibwork.png',
  },
  {
    name: 'Marinade',
    avatarUrl: 'https://github.com/marinade-finance.png',
  },
]

export async function provisionCommunitiesIfNeeded() {
  const { authority, connection, endpoint, cluster, sdk } = await getConfig()
  console.log(` -> Authority Account: ${authority.publicKey.toString()}`)
  const { config } = await createOrGetConfig()
  console.log(` -> Config Account: ${config.publicKey.toString()}`)

  const existing = await sdk.communityGetAll()
  const existingNames = existing.map((c) => c.name)
  console.log(` -> Found ${existing.length} communities`, existingNames.join(', '))

  for (const { avatarUrl, name, slug } of provisionCommunities.filter((c) => !existingNames.includes(c.name))) {
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
}
