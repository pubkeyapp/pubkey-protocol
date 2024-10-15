import { CommunityCreateOptions, getExplorerUrl, PubkeyProtocolSdk, SolanaCluster } from '@pubkey-protocol/sdk'
import { Connection, Keypair } from '@solana/web3.js'

export const provisionCommunities: Omit<CommunityCreateOptions, 'authority' | 'feePayer'>[] = [
  {
    name: 'PubKey',
    avatarUrl: 'https://github.com/pubkeyapp.png',
    // discord: 'https://discord.gg/XxuZQeDPNf',
    // github: 'https://github.com/pubkeyapp',
    // website: 'https://pubkey.app',
    // x: 'https://x.com/pubkeyapp',
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

export async function provisionCommunitiesIfNeeded(
  sdk: PubkeyProtocolSdk,
  authority: Keypair,
  feePayer: Keypair,
  connection: Connection,
  cluster: SolanaCluster,
  endpoint: string,
) {
  const existing = await sdk.communityGetAll()
  const existingNames = existing.map((c) => c.name)
  console.log(`Found ${existing.length} communities`, existingNames.join(', '))

  for (const { avatarUrl, name, slug } of provisionCommunities.filter((c) => !existingNames.includes(c.name))) {
    console.log(`Creating community: ${name}`)
    const { input, tx: transaction } = await sdk.communityCreate({
      authority: authority.publicKey,
      feePayer: feePayer.publicKey,
      avatarUrl,
      name,
      slug,
    })
    transaction.sign([authority, feePayer])
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(`Created community: ${name} ${input.slug}`, s)
    console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
  }
}
