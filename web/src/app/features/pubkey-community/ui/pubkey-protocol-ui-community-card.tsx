import { Code, Group, Stack } from '@mantine/core'
import { PubKeyCommunity } from '@pubkey-protocol/anchor'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiCard, UiDebugModal, UiStack } from '@pubkey-ui/core'
import { ExplorerLink } from '../../cluster/cluster-ui'
import { PubkeyProtocolUiCommunityAnchor } from './pubkey-protocol-ui-community-anchor'
import { PubkeyProtocolUiCommunityAvatar } from './pubkey-protocol-ui-community-avatar'

export function PubkeyProtocolUiCommunityCard({ community, to }: { community: PubKeyCommunity; to?: string }) {
  return (
    <UiCard>
      <UiStack justify="center" align="center" w="100%" my="lg">
        <PubkeyProtocolUiCommunityAvatar community={community} size="xl" />
        <Stack align="center">
          <PubkeyProtocolUiCommunityAnchor community={community} to={to} />
          <Code>{community.slug.trim()}</Code>
          <Group align="center" gap="xs">
            <ExplorerLink
              size="xs"
              ff="mono"
              path={`account/${community.publicKey}`}
              label={ellipsify(community.publicKey.toString())}
            />
            <UiDebugModal data={community} />
          </Group>
        </Stack>
      </UiStack>
    </UiCard>
  )
}
