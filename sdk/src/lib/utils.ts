import { Cluster } from '@solana/web3.js'

export type SolanaCluster = Cluster | 'local'

export function getExplorerUrl(path: string, cluster: SolanaCluster, endpoint = 'http://localhost:8899'): string {
  return `https://explorer.solana.com/${path}${getClusterUrlParam(cluster, endpoint)}`
}

export function getClusterUrlParam(cluster: SolanaCluster, endpoint = 'http://localhost:8899'): string {
  let suffix = ''
  switch (cluster) {
    case 'devnet':
      suffix = 'devnet'
      break
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

export function getCommunityAvatarUrl(slug: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${slug}`
}

export function getProfileAvatarUrl(username: string) {
  return `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`
}
