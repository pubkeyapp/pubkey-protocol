import { Switch } from '@mantine/core'
import { IdentityProvider, PubKeyCommunity } from '@pubkey-protocol/sdk'
import { toastError, toastSuccess } from '@pubkey-ui/core'
import {
  useMutationCommunityProviderDisable,
  useMutationCommunityProviderEnable,
  useQueryCommunityGet,
} from '../data-access'

export function PubkeyCommunityFeatureProviderToggle({
  community,
  disabled,
  provider,
}: {
  community: PubKeyCommunity
  disabled?: boolean
  provider: IdentityProvider
}) {
  const query = useQueryCommunityGet({ community: community.slug })
  const mutationDisable = useMutationCommunityProviderDisable({ community })
  const mutationEnable = useMutationCommunityProviderEnable({ community })

  const hasProvider = community.providers.includes(provider)

  const isLoading = query.isLoading || mutationDisable.isPending || mutationEnable.isPending

  async function disableProvider(provider: IdentityProvider) {
    mutationDisable
      .mutateAsync({ authority: community.authority, provider })
      .then(async () => {
        await query.refetch()
        toastSuccess(`Provider ${provider} disabled`)
      })
      .catch((err) => toastError(`${err}`))
  }

  async function enableProvider(provider: IdentityProvider) {
    mutationEnable
      .mutateAsync({ authority: community.authority, provider })
      .then(async () => {
        await query.refetch()
        toastSuccess(`Provider ${provider} enabled`)
      })
      .catch((err) => toastError(`${err}`))
  }

  return (
    <Switch
      disabled={disabled || isLoading || provider === IdentityProvider.Solana}
      label={hasProvider ? 'Disable' : 'Enable'}
      labelPosition="left"
      checked={hasProvider}
      onChange={() => (hasProvider ? disableProvider(provider) : enableProvider(provider))}
    />
  )
}
