import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiDebug } from '@pubkey-ui/core'
import { PubkeyProtocolUiCommunityListItem } from './pubkey-protocol-ui-community-list-item'

export function PubkeyProtocolUiCommunityCard({
  community,
  basePath,
}: {
  community: PubKeyCommunity
  basePath?: string
}) {
  return (
    <PubkeyProtocolUiCommunityListItem community={community} basePath={basePath}>
      <UiDebug data={{ basePath, community }} open />
    </PubkeyProtocolUiCommunityListItem>
  )
}
