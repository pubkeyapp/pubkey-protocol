import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { Link } from 'react-router-dom'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'

export function PubkeyProtocolUiCommunityAvatarAnchor({
  community,
  to,
  ...props
}: ActionIconProps & {
  community: PubKeyCommunity
  to: string
}) {
  return (
    <Tooltip label={community.name}>
      <ActionIcon component={Link} size="md" variant="transparent" radius="xs" to={to} {...props}>
        <PubkeyProtocolUiCommunityAvatar community={community} size="sm" />
      </ActionIcon>
    </Tooltip>
  )
}
