import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { AnchorProvider } from '@coral-xyz/anchor'
import { AnchorKeypairWallet, PubkeyProtocolSdk } from '@pubkey-protocol/sdk'

export async function getPubkeyProtocolSdk({
  connection,
  programId,
}: {
  connection: Connection
  programId: PublicKey
}) {
  await assertProgramDeployed({ connection, programId })
  const provider = new AnchorProvider(connection, new AnchorKeypairWallet(Keypair.generate()), {
    commitment: connection.commitment,
    skipPreflight: true,
  })

  return new PubkeyProtocolSdk({
    connection,
    programId,
    provider,
  })
}

async function assertEndpointUp({ connection }: { connection: Connection }) {
  try {
    const version = await connection.getVersion()
    console.log(`Endpoint is up: ${version['solana-core']}, feature set: ${version['feature-set']}`)
  } catch (err) {
    throw new Error('Endpoint not available')
  }
}

async function assertProgramDeployed({ connection, programId }: { connection: Connection; programId: PublicKey }) {
  await assertEndpointUp({ connection })
  try {
    const account = await connection.getAccountInfo(programId)
    console.log(`Program is deployed. Owner: ${account?.owner.toString()}`)
  } catch (err) {
    throw new Error('Program not deployed')
  }
}
