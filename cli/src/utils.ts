import { AnchorProvider } from '@coral-xyz/anchor'
import { AnchorKeypairWallet, PubKeyProtocolSdk } from '@pubkey-protocol/sdk'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'

let sdk: PubKeyProtocolSdk | null = null
export async function getPubkeyProtocolSdk({
  connection,
  programId,
}: {
  connection: Connection
  programId: PublicKey
}) {
  if (sdk) {
    return sdk
  }
  await assertProgramDeployed({ connection, programId })
  const provider = new AnchorProvider(connection, new AnchorKeypairWallet(Keypair.generate()), {
    commitment: connection.commitment,
    skipPreflight: true,
  })

  sdk = new PubKeyProtocolSdk({
    connection,
    programId,
    provider,
  })
  return sdk
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

export async function assertConfigInitialized({ sdk }: { sdk: PubKeyProtocolSdk }) {
  try {
    const account = await sdk.configGet({nullable: true})
    console.log(` -> Config initialized: configAuthority: ${account?.configAuthority?.toString()}`)
    return account
  } catch (err) {
    throw new Error(' ! Config not initialized')
  }
}
