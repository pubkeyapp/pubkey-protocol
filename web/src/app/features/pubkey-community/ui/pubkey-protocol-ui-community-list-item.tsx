import { Group, Stack, Text } from '@mantine/core'
import { ellipsify, PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiCard, UiDebugModal, UiGroup } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'

export function PubkeyProtocolUiCommunityListItem({
  children,
  community,
  to,
}: {
  children?: ReactNode
  community: PubKeyCommunity
  to?: string
}) {
  return (
    <UiCard>
      <UiGroup align="start" w="100%">
        <Group align="start" wrap="nowrap" gap="xs">
          <PubkeyProtocolUiCommunityAvatar community={community} />
          <Stack>
            <Stack gap={0}>
              <PubkeyProtocolUiCommunityAnchor community={community} to={to} />
              <Text size="xs" c="dimmed">
                {community.slug}
              </Text>
            </Stack>
            <Stack>{children}</Stack>
          </Stack>
        </Group>
        <Group align="center" gap="xs">
          <ExplorerLink
            size="xs"
            ff="mono"
            path={`account/${community.publicKey}`}
            label={ellipsify(community.publicKey.toString())}
          />
          <UiDebugModal data={community} />
        </Group>
      </UiGroup>
    </UiCard>
  )
}
