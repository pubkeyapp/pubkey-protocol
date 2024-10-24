import { Group } from '@mantine/core'
import { IdentityProvider, PubKeyCommunity } from '@pubkey-protocol/sdk'
import { ellipsify } from '@pubkey-protocol/sdk'
import { toastError, toastSuccess, UiBack, UiCard, UiInfo, UiLoader, UiPage } from '@pubkey-ui/core'
import { PubkeyProtocolUiCommunitySelect } from '../../pubkey-community/ui'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { useMutationProfileCreate, useQueryProfileGetByProviderNullable } from '../data-access'
import { PubkeyProtocolUiProfileCreateForm } from '../ui'

export function PubkeyProfileFeatureCreate({ community }: { community: PubKeyCommunity }) {
  const mutation = useMutationProfileCreate({
    community: community.publicKey,
  })
  const { authority } = usePubKeyProtocol()
  const pointerQuery = useQueryProfileGetByProviderNullable({
    provider: IdentityProvider.Solana,
    providerId: authority.toString(),
  })

  return (
    <UiPage
      leftAction={<UiBack />}
      title="Create Profile"
      rightAction={
        <Group>
          <PubkeyProtocolUiCommunitySelect />
        </Group>
      }
    >
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
