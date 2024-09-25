import { useQuery } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export function useQueryGetPointers() {
  const { cluster, sdk } = usePubKeyProfile()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getPointers', { cluster }],
    queryFn: () => sdk.getPointers(),
  })
}
