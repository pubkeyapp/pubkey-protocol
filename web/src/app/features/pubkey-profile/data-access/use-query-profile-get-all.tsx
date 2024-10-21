import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryProfileGetAll() {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'profileGetAll', { cluster }],
    queryFn: () => sdk.profileGetAll(),
  })
}
