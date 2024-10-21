import { PublicKey } from '@solana/web3.js'
import { Command } from 'commander'
import { inspect } from 'node:util'
import { getConfig } from '../utils/get-config'

export function getProfileCommand(): Command {
  const command = new Command('profile').description('Manage profiles')

  command
    .command('list')
    .description('List all profiles')
    .action(async () => {
      const { sdk } = await getConfig()

      const profiles = await sdk.profileGetAll()
      console.log(`Found ${profiles.length} profiles`)
      for (const profile of profiles) {
        console.log(`[${profile.username}] ${profile.name}\n${profile.publicKey} `)
      }
    })

  command
    .command('get <profile>')
    .description('Get a profile by public key or username')
    .action(async (profileId: string) => {
      const { sdk } = await getConfig()

      const profile = await sdk.profileGet({ profile: profileId })

      if (!profile) {
        console.log(`Profile not found: ${profileId}`)
        return
      }

      // FIXME: Move this logic to the SDK, we should return strings, not PublicKeys
      console.log(
        inspect(
          {
            ...profile,
            authorities: profile.authorities.map((a) => a.toString()),
            publicKey: profile.publicKey.toString(),
          },
          { colors: true, depth: 3 },
        ),
      )
    })

  // command
  //   .command('create')
  //   .description('Create a new profile')
  //   .action(async () => {
  //     // Prompt the user for the necessary information
  //     const name = await ask('Enter the name of the profile: ')
  //     console.log('Create profile functionality goes here', name)
  //     const { authority, cluster, connection, endpoint, sdk } = await getConfig()
  //
  //     const { input, tx: transaction } = await sdk.profileCreate({
  //       authority: authority.publicKey,
  //       profileAuthority: authority.publicKey,
  //       name,
  //     })
  //     transaction.sign([authority])
  //     const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
  //     console.log(`Created profile: ${name} ${input.username}`, s)
  //     console.log(getExplorerUrl(`tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
  //   })

  return command
}

function isValidPublicKey(key: string) {
  try {
    new PublicKey(key)
    return true
  } catch (err) {
    return false
  }
}
