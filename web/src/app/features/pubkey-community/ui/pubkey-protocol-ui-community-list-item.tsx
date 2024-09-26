import { ReactNode } from 'react'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiCard, UiDebugModal, UiGroup } from '@pubkey-ui/core'
import { Group, Stack } from '@mantine/core'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { ellipsify } from '../../../ui'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'

export function PubkeyProtocolUiCommunityListItem({
  children,
  community,
  basePath,
}: {
  children?: ReactNode
  community: PubKeyCommunity
  basePath?: string
}) {
  return (
    <UiCard>
      <UiGroup align="start">
        <Group align="center" wrap="nowrap" gap="xs">
          <PubkeyProtocolUiCommunityAvatar community={community} />
          <Stack gap={0}>
            <PubkeyProtocolUiCommunityAnchor slug={community.slug} basePath={basePath} />
            <ExplorerLink
              size="xs"
              ff="mono"
              path={`account/${community.publicKey}`}
              label={ellipsify(community.publicKey.toString())}
            />
          </Stack>
        </Group>
        <Group gap="xs">
          <UiDebugModal size="lg" data={community} />
        </Group>
      </UiGroup>
      {children}
    </UiCard>
  )
}
