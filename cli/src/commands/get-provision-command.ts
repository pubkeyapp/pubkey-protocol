import { Command } from 'commander'
import { provisionSampleData } from './provision-sample-data'

export function getProvisionCommand(): Command {
  return new Command('provision').description('Provision communities').action(async () => {
    try {
      await provisionSampleData()
    } catch (err) {
      console.error(`An error occurred: ${err}`)
      process.exit(1)
    }
  })
}
