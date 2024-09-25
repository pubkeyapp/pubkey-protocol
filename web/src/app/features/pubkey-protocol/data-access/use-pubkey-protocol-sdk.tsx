import { getPubkeyProtocolProgramId } from '@pubkey-program-library/anchor'
import { PubkeyProtocolSdk } from '@pubkey-program-library/sdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster as SolanaCluster } from '@solana/web3.js'
import { useMemo } from 'react'
import { useCluster } from '../../cluster/cluster-data-access'
import { useAnchorProvider } from '../../solana/solana-provider'

export function usePubkeyProtocolSdk() {
  const provider = useAnchorProvider()
  const { cluster, getExplorerUrl } = useCluster()
  const { connection } = useConnection()

  const sdk = useMemo(() => {
    const programId = getPubkeyProtocolProgramId(cluster.network as SolanaCluster)

    return new PubkeyProtocolSdk({ connection, programId, provider })
  }, [connection, cluster, provider])

  return {
    cluster,
    getExplorerUrl,
    sdk,
  }
}
