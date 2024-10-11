import { ReactNode } from 'react'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiCard, UiDebugModal, UiGroup } from '@pubkey-ui/core'
import { Code, Group, Stack } from '@mantine/core'
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
      <UiGroup align="start" w="100%">
        <Group align="start" wrap="nowrap" gap="xs">
          <PubkeyProtocolUiCommunityAvatar community={community} radius="xs" />
          <Stack>
            <Stack gap={0}>
              <PubkeyProtocolUiCommunityAnchor name={community.name} slug={community.slug} basePath={basePath} />
              <Group>
                <Code>{community.slug.trim()}</Code>
              </Group>
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
