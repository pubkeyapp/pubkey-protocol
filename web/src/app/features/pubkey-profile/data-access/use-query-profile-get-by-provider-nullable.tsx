import { IdentityProvider } from '@pubkey-protocol/sdk'
import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryProfileGetByProviderNullable({
  provider,
  providerId,
}: {
  provider: IdentityProvider
  providerId: string
}) {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfileByProviderNullable', { cluster, provider, providerId }],
    queryFn: () => sdk.profileGetByProvider({ provider, providerId}),
    retry: false,
  })
}
