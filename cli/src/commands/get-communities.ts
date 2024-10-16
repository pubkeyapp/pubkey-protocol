import { getExplorerUrl } from '@pubkey-protocol/sdk'
import { Connection } from '@solana/web3.js'
import { Command } from 'commander'
import { createInterface } from 'readline'
import { getPubkeyProtocolSdk } from '../utils'
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

export function getCommunities(): Command {
  const community = new Command('community').description('Manage communities')

  community
    .command('list')
    .description('List all communities')
    .action(async () => {
      const { endpoint, programId } = await getConfig()
      const connection = new Connection(endpoint, 'confirmed')
      const sdk = await getPubkeyProtocolSdk({ connection, programId })

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
      const { authority, cluster, endpoint, feePayer, programId } = await getConfig()
      const connection = new Connection(endpoint, 'confirmed')
      const sdk = await getPubkeyProtocolSdk({ connection, programId })

      const { input, tx: transaction } = await sdk.communityCreate({
        authority: authority.publicKey,
        feePayer: feePayer.publicKey,
        name,
      })
      transaction.sign([authority, feePayer])
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(`Created community: ${name} ${input.slug}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    })

  return community
}
