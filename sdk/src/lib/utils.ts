import { Cluster } from '@solana/web3.js'

export function slugify(str: string): string {
  // Convert to lowercase
  let slug = str.toLowerCase()

  // Replace non-alphanumeric characters (except underscore) with '_'
  slug = slug.replace(/[^a-z0-9_]/g, '_')

  // Trim to max length of 20 characters
  if (slug.length > 20) {
    slug = slug.substring(0, 20)
  }

  // Ensure minimum length of 3 characters, pad with underscores if needed
  if (slug.length < 3) {
    slug = slug.padEnd(3, '_')
  }

  return slug
}

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
