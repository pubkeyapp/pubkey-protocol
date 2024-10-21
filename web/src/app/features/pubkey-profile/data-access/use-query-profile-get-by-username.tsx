import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryProfileGetByUsername({ username }: { username: string }) {
  const { sdk, cluster } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfileByUsername', { cluster, username }],
    queryFn: () => sdk.profileGetByUsername({ username }),
  })
}
