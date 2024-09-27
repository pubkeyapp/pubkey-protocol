import { Group, Stack } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { UiDebugModal } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { UiAvatar } from '../../../ui/ui-avatar'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'

export function PubkeyProtocolUiCommunity({
  children,
  community,
  basePath,
}: {
  children?: ReactNode
  community: PubKeyCommunity
  basePath?: string
}) {
  return (
    <Group align="start" wrap="nowrap" justify="space-between" w="100%">
      <Group align="start" wrap="nowrap">
        <UiAvatar url={community.avatarUrl ? community.avatarUrl : null} name={community.slug} radius="md" size="lg" />
        <Stack gap={0}>
          <PubkeyProtocolUiCommunityAnchor slug={community.slug} basePath={basePath} />
          {children ?? community.name}
        </Stack>
      </Group>
      <UiDebugModal data={community} />
    </Group>
  )
}
