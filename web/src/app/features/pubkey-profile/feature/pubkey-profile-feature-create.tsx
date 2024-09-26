import { PubKeyIdentityProvider } from '@pubkey-protocol/anchor'
import { toastError, toastSuccess, UiCard, UiInfo, UiLoader, UiPage } from '@pubkey-ui/core'
import { IconUserPlus } from '@tabler/icons-react'
import { ellipsify } from '../../../ui'
import { useMutationCreateProfile, useQueryGetProfileByProviderNullable } from '../data-access'
import { PubkeyProtocolUiProfileCreateForm } from '../ui'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function PubkeyProfileFeatureCreate() {
  const mutation = useMutationCreateProfile()
  const { authority } = usePubKeyProtocol()
  const pointerQuery = useQueryGetProfileByProviderNullable({
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
          <PubkeyProtocolUiProfileCreateForm
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
