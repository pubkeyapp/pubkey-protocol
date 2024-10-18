import { IdentityProvider } from '@pubkey-protocol/anchor'
import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryGetProfileByProviderNullable({
  provider,
  providerId,
}: {
  provider: IdentityProvider
  providerId: string
}) {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfileByProviderNullable', { cluster, provider, providerId }],
    queryFn: () => sdk.profileGetByProviderNullable({ provider, providerId }),
    retry: false,
  })
}
