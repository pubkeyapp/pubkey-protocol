import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { toastError, UiCard } from '@pubkey-ui/core'
import { useMutationUpdateCommunity, useQueryGetCommunityBySlug } from '../data-access'
import { PubkeyProtocolUiCommunityUpdateForm } from '../ui'
import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'

export function PubkeyCommunityFeatureSettings({ community }: { community: PubKeyCommunity }) {
  const query = useQueryGetCommunityBySlug({ slug: community.slug })
  const mutation = useMutationUpdateCommunity()

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
