import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { toastError, UiCard } from '@pubkey-ui/core'
import { useMutationUpdateCommunity } from '../data-access'
import { PubkeyProtocolUiCommunityUpdateForm } from '../ui'

export function PubkeyCommunityFeatureSettings({ community }: { community: PubKeyCommunity }) {
  const mutation = useMutationUpdateCommunity()

  return (
    <UiCard>
      <PubkeyProtocolUiCommunityUpdateForm
        community={community}
        submit={(input) =>
          mutation
            .mutateAsync(input)
            .then((res) => {
              console.log('res', res)
            })
            .catch((err) => toastError(`Error: ${err}`))
        }
      />
    </UiCard>
  )
}
