import { getExplorerUrl } from '@pubkey-protocol/sdk'
import { Command } from 'commander'
import { createInterface } from 'readline'
import { getConfig } from '../utils/get-config'

async function ask(message: string): Promise<string> {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    readline.question(message, (answer) => {
      readline.close()
      resolve(answer)
    })
  })
}

export function getCommunityCommand(): Command {
  const community = new Command('community').description('Manage communities')

  community
    .command('list')
    .description('List all communities')
    .action(async () => {
      const { sdk } = await getConfig()

      const communities = await sdk.communityGetAll()
      console.log(`Found ${communities.length} communities:`, communities.map((c) => c.name).join(', '))
    })

  community
    .command('create')
    .description('Create a new community')
    .action(async () => {
      // Prompt the user for the necessary information
      const name = await ask('Enter the name of the community: ')
      console.log('Create community functionality goes here', name)
      const { authority, cluster, connection, endpoint, feePayer, sdk } = await getConfig()

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

  return community
}
