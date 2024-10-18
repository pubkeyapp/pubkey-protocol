import { getKeypairFromFile } from '@solana-developers/helpers'
import { Connection } from '@solana/web3.js'
import { Command } from 'commander'
import { getPubkeyProtocolSdk } from '../utils'
import { ensureBalance } from '../utils/ensure-balance'
import { getConfig } from '../utils/get-config'
import { getDefaultFeePayer } from '../utils/get-default-fee-payer'
import { provisionCommunitiesIfNeeded } from './provision-communities'

export function getProvisionCommand(): Command {
  return new Command('provision').description('Provision communities').action(async () => {
    try {
      const { endpoint, cluster, programId } = await getConfig()
      const connection = new Connection(endpoint, 'confirmed')
      const sdk = await getPubkeyProtocolSdk({ connection, programId })
      const feePayer = getDefaultFeePayer()
      const authority = await getKeypairFromFile(process.env.AUTHORITY_KEYPAIR_PATH)

      await ensureBalance(connection, feePayer.publicKey)
      await provisionCommunitiesIfNeeded(sdk, authority, feePayer, connection, cluster, endpoint)
    } catch (err) {
      console.error(`An error occurred: ${err}`)
      process.exit(1)
    }
  })
}
