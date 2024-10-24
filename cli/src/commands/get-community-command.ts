import { getExplorerUrl } from '@pubkey-protocol/sdk'
import { Command } from 'commander'
import { getConfig } from '../utils/get-config'
import { readInput } from '../utils/read-input'

export function getCommunityCommand(): Command {
  const command = new Command('community').description('Manage communities')

  command
    .command('list')
    .description('List all communities')
    .action(async () => {
      const { sdk } = await getConfig()

      const communities = await sdk.communityGetAll()
      console.log(`Found ${communities.length} communities`)
      for (const community of communities) {
        console.log(`[${community.slug}] ${community.name}\n${community.publicKey} `)
      }
    })

  command
    .command('get <community>')
    .description('Get a community by public key or slug')
    .action(async (communityId: string) => {
      const { sdk } = await getConfig()

      const community = await sdk.communityGet({ community: communityId })

      if (!community) {
        console.log(`Community not found: ${communityId}`)
        return
      }

      console.log(community)
    })

  command
    .command('create')
    .description('Create a new community')
    .action(async () => {
      // Prompt the user for the necessary information
      const name = await readInput('Enter the name of the community: ')
      console.log('Create community functionality goes here', name)
      const { authority, cluster, connection, endpoint, sdk } = await getConfig()

      const { input, tx: transaction } = await sdk.communityCreate({
        authority: authority.publicKey,
        communityAuthority: authority.publicKey,
        name,
      })
      transaction.sign([authority])
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(`Created community: ${name} ${input.slug}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    })

  return command
}
