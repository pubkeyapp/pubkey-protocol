import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryCommunityGetBySlug({ slug }: { slug: string }) {
  const { sdk, cluster } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'communityGetBySlug', { cluster, slug }],
    queryFn: () => sdk.communityGetBySlug({ slug }),
  })
}
