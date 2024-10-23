import { AnchorProvider } from '@coral-xyz/anchor'
import { getPubkeyProtocolProgramId, PubKeyProtocolSdk } from '@pubkey-protocol/sdk'
import { AnchorWallet, Wallet } from '@solana/wallet-adapter-react'
import { Cluster as SolanaCluster, Connection } from '@solana/web3.js'
import { useMemo } from 'react'

export function usePubkeyProtocolSdk({
  connection,
  network,
  wallet,
}: {
  connection: Connection
  wallet: Wallet
  network: SolanaCluster
}) {
  return useMemo(() => {
    const provider = new AnchorProvider(connection, wallet as unknown as AnchorWallet, { commitment: 'confirmed' })
    const programId = getPubkeyProtocolProgramId(network as SolanaCluster)

    return new PubKeyProtocolSdk({ connection, programId, provider })
  }, [connection, network, wallet])
}
