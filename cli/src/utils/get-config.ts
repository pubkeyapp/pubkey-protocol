import { PUBKEY_PROTOCOL_PROGRAM_ID } from '@pubkey-protocol/anchor'
import { SolanaCluster } from '@pubkey-protocol/sdk'
import { getKeypairFromFile } from '@solana-developers/helpers'
import { Connection, PublicKey } from '@solana/web3.js'
import process from 'node:process'
import { getPubkeyProtocolSdk } from '../utils'
import { getConfigKeypair } from './get-config-keypair'

export async function getConfig() {
  const cluster: SolanaCluster = 'local'
  const endpoint = process.env.SOLANA_RPC_ENDPOINT || 'http://localhost:8899'
  const programId = new PublicKey(process.env.PUBKEY_PROTOCOL_PROGRAM_ID || PUBKEY_PROTOCOL_PROGRAM_ID)
  const connection = new Connection(endpoint, 'confirmed')
  const sdk = await getPubkeyProtocolSdk({ connection, programId })
  const configAuthority = getConfigKeypair()
  const authority = await getKeypairFromFile(process.env.AUTHORITY_KEYPAIR_PATH)

  return {
    authority,
    cluster,
    configAuthority,
    connection,
    endpoint,
    programId,
    sdk,
  }
}
