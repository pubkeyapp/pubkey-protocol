import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol/data-access/pubkey-protocol-provider'

export function useQueryPointerGetAll() {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getPointers', { cluster }],
    queryFn: () => sdk.pointerGetAll(),
  })
}
