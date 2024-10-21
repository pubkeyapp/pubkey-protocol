import { Command } from 'commander'
import * as process from 'node:process'
import { getCommunityCommand } from './commands/get-community-command'
import { getConfigCommand } from './commands/get-config-command'
import { getHelloCommand } from './commands/get-hello-command'
import { getProvisionCommand } from './commands/get-provision-command'

const program = new Command()
  .addCommand(getCommunityCommand())
  .addCommand(getConfigCommand())
  .addCommand(getHelloCommand())
  .addCommand(getProvisionCommand())

program.parse(process.argv)
