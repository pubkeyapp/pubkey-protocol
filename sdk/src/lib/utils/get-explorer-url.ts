import { Cluster } from '@solana/web3.js'

export type SolanaCluster = Cluster | 'mainnet' | 'local'

export function getExplorerUrl(path: string, cluster: SolanaCluster, endpoint = 'http://localhost:8899'): string {
  return `https://explorer.solana.com${path.startsWith('/') ? path : `/${path}`}${getClusterUrlParam(
    cluster,
    endpoint,
  )}`
}

function getClusterUrlParam(cluster: SolanaCluster, endpoint = 'http://localhost:8899'): string {
  let suffix = ''
  switch (cluster) {
    case 'devnet':
      suffix = 'devnet'
      break
    case 'mainnet':
    case 'mainnet-beta':
      suffix = 'mainnet'
      break
    case 'testnet':
      suffix = 'testnet'
      break
    default:
      suffix = `custom&customUrl=${encodeURIComponent(endpoint)}`
      break
  }

  return suffix.length ? `?cluster=${suffix}` : ''
}
