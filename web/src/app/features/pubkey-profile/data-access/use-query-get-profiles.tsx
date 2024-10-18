import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryGetProfiles() {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfiles', { cluster }],
    queryFn: () => sdk.getProfiles(),
  })
}
