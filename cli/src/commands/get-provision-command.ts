import { Command } from 'commander'
import { provisionSampleData } from './provision-sample-data'

export function getProvisionCommand(): Command {
  return new Command('provision')
    .description('Provision communities')
    .option('--dry-run', 'Dry run', 'false')
    .option('--timeout <ms>', 'Timeout in milliseconds', '100')
    .action(async (options) => {
      const dryRun = false
      const timeout = options.timeout ? parseInt(options.timeout) : 100
      try {
        await provisionSampleData({ dryRun, timeout })
      } catch (err) {
        console.error(`An error occurred: ${err}`)
        process.exit(1)
      }
    })
}
