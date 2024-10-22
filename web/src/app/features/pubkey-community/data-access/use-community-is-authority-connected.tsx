import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo } from 'react'

export function useCommunityIsAuthorityConnected({ community }: { community: PubKeyCommunity }) {
  const { publicKey: wallet, connected } = useWallet()

  return useMemo(
    () => connected && community.authority.toString() === wallet?.toString(),
    [connected, community.authority, wallet],
  )
}
