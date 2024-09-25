import { useQuery } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export function useQueryGetProfileByUsername({ username }: { username: string }) {
  const { sdk, cluster } = usePubKeyProfile()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfileByUsername', { cluster, username }],
    queryFn: () => sdk.getProfileByUsername({ username }),
  })
}
