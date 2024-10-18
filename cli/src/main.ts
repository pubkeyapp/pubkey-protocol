import { Command } from 'commander'
import * as process from 'node:process'
import { getCommunities } from './commands/get-communities'
import { getHelloCommand } from './commands/get-hello-command'
import { getProvisionCommand } from './commands/get-provision-command'

const program = new Command()
  .addCommand(getCommunities())
  .addCommand(getHelloCommand())
  .addCommand(getProvisionCommand())

program.parse(process.argv)
