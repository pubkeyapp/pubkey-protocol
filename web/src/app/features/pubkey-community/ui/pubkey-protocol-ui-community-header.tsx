import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiStack } from '@pubkey-ui/core'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'
import { PubkeyProtocolUiCommunitySocials } from './pubkey-protocol-ui-community-socials'

export function PubkeyProtocolUiCommunityHeader({ community, to }: { community: PubKeyCommunity; to?: string }) {
  return (
    <UiStack justify="center" align="center" w="100%" my="lg">
      <PubkeyProtocolUiCommunityAvatar community={community} size="xl" />
      <PubkeyProtocolUiCommunityAnchor community={community} to={to} />
      <PubkeyProtocolUiCommunitySocials community={community} />
    </UiStack>
  )
}
