import { getPubkeyProfileProgramId } from '@pubkey-program-library/anchor'
import { PubKeyProfileSdk } from '@pubkey-program-library/sdk'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster } from '@solana/web3.js'
import { useMemo } from 'react'
import { useCluster } from '../../cluster/cluster-data-access'
import { useAnchorProvider } from '../../solana/solana-provider'

export function usePubkeyProfileSdk() {
  const { connection } = useConnection()
  const { cluster, getExplorerUrl } = useCluster()
  const provider = useAnchorProvider()

  const sdk = useMemo(() => {
    const programId = getPubkeyProfileProgramId(cluster.network as Cluster)

    return new PubKeyProfileSdk({ connection, programId, provider })
  }, [connection, cluster, provider])

  return {
    connection,
    cluster,
    getExplorerUrl,
    sdk,
  }
}
