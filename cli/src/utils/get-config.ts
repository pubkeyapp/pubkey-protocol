import { PUBKEY_PROTOCOL_PROGRAM_ID } from '@pubkey-protocol/anchor'
import { SolanaCluster } from '@pubkey-protocol/sdk'
import { getKeypairFromFile } from '@solana-developers/helpers'
import { PublicKey } from '@solana/web3.js'
import process from 'node:process'
import { getDefaultFeePayer } from './get-default-fee-payer'

export async function getConfig() {
  const endpoint = process.env.SOLANA_RPC_ENDPOINT || 'http://localhost:8899'
  const cluster: SolanaCluster = 'local'
  const programId = new PublicKey(process.env.PUBKEY_PROTOCOL_PROGRAM_ID || PUBKEY_PROTOCOL_PROGRAM_ID)
  const feePayer = getDefaultFeePayer()
  const authority = await getKeypairFromFile(process.env.AUTHORITY_KEYPAIR_PATH)

  return {
    authority,
    cluster,
    endpoint,
    feePayer,
    programId,
  }
}
