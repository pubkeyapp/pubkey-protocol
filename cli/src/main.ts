import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { PUBKEY_PROTOCOL_PROGRAM_ID } from '@pubkey-protocol/anchor'
import { getPubkeyProtocolSdk } from './utils'
import { getKeypairFromFile } from '@solana-developers/helpers'
import * as process from 'node:process'
import { getExplorerUrl, SolanaCluster } from '@pubkey-protocol/sdk'
import { communities } from './communities'

const endpoint = process.env.SOLANA_RPC_ENDPOINT || 'http://localhost:8899'
const cluster: SolanaCluster = 'local'
const programId = new PublicKey(process.env.PUBKEY_PROTOCOL_PROGRAM_ID || PUBKEY_PROTOCOL_PROGRAM_ID)

async function main() {
  const connection = new Connection(endpoint, 'confirmed')
  const sdk = await getPubkeyProtocolSdk({ connection, programId })
  const authority = await getKeypairFromFile(process.env.AUTHORITY_KEYPAIR_PATH)

  // Ensure the authority has any SOL in their account
  const balance = await connection.getBalance(authority.publicKey)
  if (balance < 0) {
    console.log(`Account has no SOL: ${authority.publicKey.toString()}`)
    return
  }
  console.log(`Account has ${balance / LAMPORTS_PER_SOL} SOL: ${authority.publicKey.toString()}`)

  const existing = await sdk.getCommunities()
  const existingNames = existing.map((c) => c.name)
  console.log(`Found ${existing.length} communities`, existingNames.join(', '))

  for (const { avatarUrl, name, slug } of communities.filter((c) => !existingNames.includes(c.name))) {
    console.log(`Creating community: ${name}`)
    const { input, tx: transaction } = await sdk.createCommunity({
      authority: authority.publicKey,
      feePayer: authority.publicKey,
      avatarUrl,
      name,
      slug,
    })
    transaction.sign([authority])
    const s = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true })
    console.log(`Created community: ${name} ${input.slug}`, s)
    console.log(getExplorerUrl(`/tx/${s}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, cluster, endpoint))
  }
}

main().catch((err) => {
  console.error(`An error occurred: ${err}`)
  process.exit(1)
})
