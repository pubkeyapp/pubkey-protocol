import { PubKeyIdentityProvider } from '@pubkey-protocol/anchor'
import { useQuery } from '@tanstack/react-query'
import { usePubKeyProfile } from './pubkey-protocol-provider'

export function useGetProfileByProviderNullable({
  provider,
  providerId,
}: {
  provider: PubKeyIdentityProvider
  providerId: string
}) {
  const { cluster, sdk } = usePubKeyProfile()

  return useQuery({
    queryKey: ['pubkey-protocol', 'getProfileByProviderNullable', { cluster, provider, providerId }],
    queryFn: () => sdk.getProfileByProviderNullable({ provider, providerId }),
    retry: false,
  })
}
