import { PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import { toastError, toastSuccess, UiCard, UiLoader, UiWarning } from '@pubkey-ui/core'
import { useGetProfileByProviderNullable, useMutationCreateProfile, usePubKeyProfile } from '../data-access'
import { PubkeyProfileUiCreateForm } from '../ui'

export function PubkeyProfileFeatureCreate() {
  const mutation = useMutationCreateProfile()
  const { authority } = usePubKeyProfile()
  const pointerQuery = useGetProfileByProviderNullable({
    provider: PubKeyIdentityProvider.Solana,
    providerId: authority.toString(),
  })

  return pointerQuery.isLoading ? (
    <UiLoader />
  ) : pointerQuery.data ? (
    <UiWarning message={`This authority is already registered with username ${pointerQuery.data?.username}`} />
  ) : (
    <UiCard title="Create Profile">
      <PubkeyProfileUiCreateForm
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
