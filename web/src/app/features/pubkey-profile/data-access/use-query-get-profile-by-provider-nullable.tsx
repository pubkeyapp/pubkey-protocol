import { PubKeyIdentityProvider } from '@pubkey-protocol/anchor'
import { useQuery } from '@tanstack/react-query'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function useQueryGetProfileByProviderNullable({
  provider,
  providerId,
}: {
  provider: PubKeyIdentityProvider
  providerId: string
}) {
  const { cluster, sdk } = usePubKeyProtocol()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfileByProviderNullable', { cluster, provider, providerId }],
    queryFn: () => sdk.getProfileByProviderNullable({ provider, providerId }),
    retry: false,
  })
}
