import { IdentityProvider } from '@pubkey-protocol/anchor'
import { ellipsify } from '@pubkey-protocol/sdk'
import { toastError, toastSuccess, UiCard, UiInfo, UiLoader } from '@pubkey-ui/core'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { useMutationProfileCreate, useQueryGetProfileByProviderNullable } from '../data-access'
import { PubkeyProtocolUiProfileCreateForm } from '../ui'

export function PubkeyProfileFeatureCreate() {
  const mutation = useMutationProfileCreate()
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
