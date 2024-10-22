import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { toastError, UiCard } from '@pubkey-ui/core'
import { useMutationCommunityUpdate, useQueryCommunityGetBySlug } from '../data-access'
import { PubkeyProtocolUiCommunityUpdateForm } from '../ui'
import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'

export function PubkeyCommunityFeatureSettings({ community }: { community: PubKeyCommunity }) {
  const query = useQueryCommunityGetBySlug({ slug: community.slug })
  const mutation = useMutationCommunityUpdate()

  return (
    <UiCard>
      <PubkeyProtocolUiCommunityAuthorityGuard community={community}>
        <PubkeyProtocolUiCommunityUpdateForm
          community={community}
          submit={(input) =>
            mutation
              .mutateAsync(input)
              .then(async () => {
                await query.refetch()
              })
              .catch((err) => toastError(`Error: ${err}`))
          }
        />
      </PubkeyProtocolUiCommunityAuthorityGuard>
    </UiCard>
  )
}
