import { useQuery } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-profile-provider'

export function useQueryGetProfileByUsername({ username }: { username: string }) {
  const { sdk, cluster } = usePubKeyProfile()

  return useQuery({
    queryKey: ['pubkey-profile', 'getProfileByUsername', { cluster, username }],
    queryFn: () => sdk.getProfileByUsername({ username }),
  })
}
