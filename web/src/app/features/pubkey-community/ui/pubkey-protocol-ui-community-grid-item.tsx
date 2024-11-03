import { Group, Stack } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/sdk'
import { UiDebugModal, UiStack } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'
import { PubkeyProtocolUiCommunityDescription } from './pubkey-protocol-ui-community-description'
import { PubkeyProtocolUiCommunitySocials } from './pubkey-protocol-ui-community-socials'

export function PubkeyProtocolUiCommunityGridItem({
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
        <PubkeyProtocolUiCommunityAvatar community={community} />
        <Stack gap={0}>
          <PubkeyProtocolUiCommunityAnchor community={community} to={`${basePath}/${community.slug}`} />
          {children ?? (
            <UiStack>
              <PubkeyProtocolUiCommunityDescription community={community} />
              <PubkeyProtocolUiCommunitySocials community={community} />
            </UiStack>
          )}
        </Stack>
      </Group>
      <UiDebugModal data={community} />
    </Group>
  )
}
