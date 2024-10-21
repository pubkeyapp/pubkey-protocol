import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryCommunityGetAll() {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'communityGetAll', { cluster }],
    queryFn: () => sdk.communityGetAll(),
  })
}
