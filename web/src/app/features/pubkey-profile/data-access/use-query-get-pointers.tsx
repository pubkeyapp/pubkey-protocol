import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryGetPointers() {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getPointers', { cluster }],
    queryFn: () => sdk.getPointers(),
  })
}
