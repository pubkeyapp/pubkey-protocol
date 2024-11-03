import { getExplorerUrl } from '@pubkey-protocol/sdk'
import { Command } from 'commander'
import { getConfig } from '../utils/get-config'
import { createOrGetConfig } from './create-or-get-config'

export function getConfigCommand(): Command {
  const command = new Command('config').description('Manage config')

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
