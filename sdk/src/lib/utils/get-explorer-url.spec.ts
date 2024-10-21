import { getExplorerUrl, SolanaCluster } from './get-explorer-url'

describe('getExplorerUrl', () => {
  const baseUrl = 'https://explorer.solana.com'

  it('should return the correct URL for mainnet', () => {
    const path = '/tx/some-tx-id'
    const cluster: SolanaCluster = 'mainnet'
    const result = getExplorerUrl(path, cluster)
    expect(result).toBe(`${baseUrl}${path}?cluster=mainnet`)
  })

  it('should return the correct URL for devnet', () => {
    const path = '/address/some-address'
    const cluster: SolanaCluster = 'devnet'
    const result = getExplorerUrl(path, cluster)
    expect(result).toBe(`${baseUrl}${path}?cluster=devnet`)
  })

  it('should return the correct URL for testnet', () => {
    const path = 'block'
    const cluster: SolanaCluster = 'testnet'
    const result = getExplorerUrl(path, cluster)
    expect(result).toBe(`${baseUrl}/block?cluster=testnet`)
  })

  it('should return the correct URL for a custom local endpoint', () => {
    const path = 'slot/1234'
    const cluster: SolanaCluster = 'local'
    const endpoint = 'http://localhost:8899'
    const result = getExplorerUrl(path, cluster, endpoint)
    expect(result).toBe(`${baseUrl}/slot/1234?cluster=custom&customUrl=${encodeURIComponent(endpoint)}`)
  })

  it('should return the correct URL if path does not start with a slash', () => {
    const path = 'account/some-account-id'
    const cluster: SolanaCluster = 'mainnet-beta'
    const result = getExplorerUrl(path, cluster)
    expect(result).toBe(`${baseUrl}/account/some-account-id?cluster=mainnet`)
  })

  it('should concatenate path correctly if it starts with a slash', () => {
    const path = '/token/some-token-id'
    const cluster: SolanaCluster = 'local'
    const endpoint = 'https://custom-solana.com'
    const result = getExplorerUrl(path, cluster, endpoint)
    expect(result).toBe(`${baseUrl}/token/some-token-id?cluster=custom&customUrl=${encodeURIComponent(endpoint)}`)
  })

  it('should default to localhost for unknown cluster', () => {
    const path = '/recent'
    // Typing 'unknown' to bypass type constraints for testing purposes
    const cluster = 'unknown' as SolanaCluster
    const endpoint = 'http://localhost:8899'
    const result = getExplorerUrl(path, cluster, endpoint)
    expect(result).toBe(`${baseUrl}/recent?cluster=custom&customUrl=${encodeURIComponent(endpoint)}`)
  })

  it('should work with non-default endpoint', () => {
    const path = 'transaction/123'
    const cluster: SolanaCluster = 'local'
    const endpoint = 'https://solana-custom-endpoint.io'
    const result = getExplorerUrl(path, cluster, endpoint)
    expect(result).toBe(`${baseUrl}/transaction/123?cluster=custom&customUrl=${encodeURIComponent(endpoint)}`)
  })
})
