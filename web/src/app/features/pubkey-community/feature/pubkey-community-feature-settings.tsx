import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { toastError, UiCard } from '@pubkey-ui/core'
import { UiAbout } from '../../../ui'
import { useMutationCommunityUpdate, useQueryCommunityGet } from '../data-access'
import { PubkeyProtocolUiCommunityUpdateForm } from '../ui'
import { PubkeyProtocolUiCommunityAuthorityGuard } from '../ui/pubkey-protocol-ui-community-authority-guard'

export function PubkeyCommunityFeatureSettings({ community }: { community: PubKeyCommunity }) {
  const query = useQueryCommunityGet({ community: community.slug })
  const mutation = useMutationCommunityUpdate()

  return (
    <UiCard>
      <UiAbout
        title="About Settings"
        content={'These community settings are stored onchain and can be updated by the community authority.'}
      />

      <PubkeyProtocolUiCommunityAuthorityGuard
        community={community}
        render={({ disabled }) => (
          <PubkeyProtocolUiCommunityUpdateForm
            community={community}
            disabled={disabled}
            submit={(input) =>
              mutation
                .mutateAsync(input)
                .then(async () => {
                  await query.refetch()
                })
                .catch((err) => toastError(`Error: ${err}`))
            }
          />
        )}
      ></PubkeyProtocolUiCommunityAuthorityGuard>
    </UiCard>
  )
}
