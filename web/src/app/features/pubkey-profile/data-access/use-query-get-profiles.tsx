import { useQuery } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-profile-provider'

export function useQueryGetProfiles() {
  const { cluster, sdk } = usePubKeyProfile()

  return useQuery({
    queryKey: ['pubkey-profile', 'getProfiles', { cluster }],
    queryFn: () => sdk.getProfiles(),
  })
}
