import { IdentityProvider } from '@pubkey-protocol/anchor'
import { toastError, toastSuccess, UiCard, UiInfo, UiLoader } from '@pubkey-ui/core'
import { ellipsify } from '../../../ui'
import { useMutationCreateProfile, useQueryGetProfileByProviderNullable } from '../data-access'
import { PubkeyProtocolUiProfileCreateForm } from '../ui'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function PubkeyProfileFeatureCreate() {
  const mutation = useMutationCreateProfile()
  const { authority } = usePubKeyProtocol()
  const pointerQuery = useQueryGetProfileByProviderNullable({
    provider: IdentityProvider.Solana,
    providerId: authority.toString(),
  })

  return pointerQuery.isLoading ? (
    <UiLoader />
  ) : pointerQuery.data ? (
    <UiInfo
      message={`Authority ${ellipsify(authority.toString())} is already registered with username ${
        pointerQuery.data?.username
      }`}
    />
  ) : (
    <UiCard title="Create Profile">
      <PubkeyProtocolUiProfileCreateForm
        submit={(input) =>
          mutation
            .mutateAsync(input)
            .then(() => toastSuccess(`Profile created`))
            .catch((err) => toastError(`Error: ${err}`))
        }
      />
    </UiCard>
  )
}
