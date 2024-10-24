import { Group, GroupProps } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'

export function PubkeyProtocolUiCommunityLinkItem({
  community,
  to,
  ...props
}: GroupProps & { community: PubKeyCommunity; to?: string }) {
  return (
    <Group gap={6} {...props}>
      <PubkeyProtocolUiCommunityAvatar community={community} size="xs" />
      <PubkeyProtocolUiCommunityAnchor community={community} to={to ?? `/communities/${community.slug}`} size="xs" />
    </Group>
  )
}
