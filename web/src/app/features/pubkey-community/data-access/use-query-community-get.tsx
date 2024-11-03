import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryCommunityGet({ community }: { community: string }) {
  const { sdk, cluster } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'communityGet', { cluster, community }],
    queryFn: () => sdk.communityGet({ community }),
  })
}
