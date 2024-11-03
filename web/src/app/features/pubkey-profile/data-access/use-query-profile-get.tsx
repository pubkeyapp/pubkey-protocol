import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryProfileGet({ username }: { username: string }) {
  const { sdk, cluster } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'profileGet', { cluster, username }],
    queryFn: () => sdk.profileGet({ profile: username }),
  })
}
