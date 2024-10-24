import { Command } from 'commander'

export function getHelloCommand(): Command {
  return new Command('hello').description('Outputs "world"').action(() => {
    console.log('world11')
  })
}
