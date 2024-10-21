import { Group, GroupProps } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'

export function PubkeyProtocolUiCommunityItem({ community, ...props }: GroupProps & { community: PubKeyCommunity }) {
  return (
    <Group gap="sm" {...props}>
      <PubkeyProtocolUiCommunityAvatar community={community} size="sm" />
      <PubkeyProtocolUiCommunityAnchor community={community} />
    </Group>
  )
}
