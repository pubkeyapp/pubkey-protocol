import { useQuery } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export function useQueryGetProfiles() {
  const { cluster, sdk } = usePubKeyProfile()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfiles', { cluster }],
    queryFn: () => sdk.getProfiles(),
  })
}
