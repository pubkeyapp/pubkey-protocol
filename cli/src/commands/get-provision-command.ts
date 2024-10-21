import { Command } from 'commander'
import { ensureBalance } from '../utils/ensure-balance'
import { getConfig } from '../utils/get-config'
import { provisionCommunitiesIfNeeded } from './provision-communities'

export function getProvisionCommand(): Command {
  return new Command('provision').description('Provision communities').action(async () => {
    try {
      const { connection, feePayer } = await getConfig()

      await ensureBalance(connection, feePayer.publicKey)
      await provisionCommunitiesIfNeeded()
    } catch (err) {
      console.error(`An error occurred: ${err}`)
      process.exit(1)
    }
  })
}
