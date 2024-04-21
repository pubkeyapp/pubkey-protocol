import { PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import { toastError, toastSuccess, UiCard, UiInfo, UiLoader, UiPage } from '@pubkey-ui/core'
import { IconUserPlus } from '@tabler/icons-react'
import { ellipsify } from '../../../ui'
import { useGetProfileByProviderNullable, useMutationCreateProfile, usePubKeyProfile } from '../data-access'
import { PubkeyProfileUiCreateForm } from '../ui'

export function PubkeyProfileFeatureCreate() {
  const mutation = useMutationCreateProfile()
  const { authority } = usePubKeyProfile()
  const pointerQuery = useGetProfileByProviderNullable({
    provider: PubKeyIdentityProvider.Solana,
    providerId: authority.toString(),
  })

  return (
    <UiPage leftAction={<IconUserPlus />} title="Create Profile">
      {pointerQuery.isLoading ? (
        <UiLoader />
      ) : pointerQuery.data ? (
        <UiInfo
          message={`Authority ${ellipsify(authority.toString())} is already registered with username ${
            pointerQuery.data?.username
          }`}
        />
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
      )}
    </UiPage>
  )
}
