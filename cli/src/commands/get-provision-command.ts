import { Command } from 'commander'
import { provisionCommunitiesIfNeeded } from './provision-communities'

export function getProvisionCommand(): Command {
  return new Command('provision').description('Provision communities').action(async () => {
    try {
      await provisionCommunitiesIfNeeded()
    } catch (err) {
      console.error(`An error occurred: ${err}`)
      process.exit(1)
    }
  })
}
