import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from './pubkey-protocol-provider'

export function useQueryConfigGet() {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'configGetNullable', { cluster }],
    queryFn: () => sdk.configGetNullable(),
  })
}
