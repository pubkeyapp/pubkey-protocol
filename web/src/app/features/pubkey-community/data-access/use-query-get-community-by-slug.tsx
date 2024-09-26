import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryGetCommunityBySlug({ slug }: { slug: string }) {
  const { sdk, cluster } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getCommunityBySlug', { cluster, slug }],
    queryFn: () => sdk.getCommunityBySlug({ slug }),
  })
}
