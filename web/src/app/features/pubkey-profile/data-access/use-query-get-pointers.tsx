import { useQuery } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-profile-provider'

export function useQueryGetPointers() {
  const { cluster, sdk } = usePubKeyProfile()

  return useQuery({
    queryKey: ['pubkey-profile', 'getPointers', { cluster }],
    queryFn: () => sdk.getPointers(),
  })
}
