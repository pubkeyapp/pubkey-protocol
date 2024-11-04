import { getExplorerUrl } from '@pubkey-protocol/sdk'
import { Command } from 'commander'
import { getConfig } from '../utils/get-config'
import { createOrGetConfig } from './create-or-get-config'

export function getConfigCommand(): Command {
  const command = new Command('config').description('Manage config')

  command
    .command('delete-pointer <pointer>')
    .description('Delete a pointer')
    .action(async (pointer: string) => {
      const { configAuthority, cluster, connection, endpoint, sdk } = await getConfig()
      const { tx: transaction } = await sdk.configDeletePointer({
        configAuthority: configAuthority.publicKey,
        pointer,
      })
      transaction.sign([configAuthority])
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(`Created pointer: ${pointer}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    })

  command
    .command('delete-profile <profile>')
    .description('Delete a profile')
    .action(async (profile: string) => {
      const { configAuthority, cluster, connection, endpoint, sdk } = await getConfig()
      const { tx: transaction } = await sdk.configDeleteProfile({
        configAuthority: configAuthority.publicKey,
        profile,
      })
      transaction.sign([configAuthority])
      const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
      console.log(`Created profile: ${profile}`, s)
      console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
    })

  command
    .command('get')
    .description('Get the config')
    .action(async () => {
      const { sdk } = await getConfig()

      const config = await sdk.configGet({ nullable: true })

      console.log(
        config?.configAuthority
          ? `Found config with authority ${config?.configAuthority?.toString()}`
          : 'No config found',
      )
    })

  command
    .command('init')
    .description('Initialize the config')
    .action(async () => {
      const { cluster, endpoint } = await getConfig()

      const { signature } = await createOrGetConfig()
      console.log(`Initialized config`)
      console.log(
        getExplorerUrl(`tx/${signature}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint),
      )
    })

  return command
}
