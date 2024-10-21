import { Divider, Group, Text } from '@mantine/core'
import { PubKeyIdentity } from '@pubkey-protocol/anchor'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiAnchor, UiGroup, UiStack } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { usePubKeyCommunity } from '../../pubkey-community/data-access'
import { PubkeyProtocolUiCommunityLinkItem } from '../../pubkey-community/ui'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { PubkeyProtocolUiIdentityProviderIcon } from './pubkey-protocol-ui-identity-provider-icon'

export function PubkeyProtocolUiIdentity({ action, identity }: { action?: ReactNode; identity: PubKeyIdentity }) {
  const { getIdentityUrl } = usePubKeyProtocol()
  const { communityMap } = usePubKeyCommunity()
  const url = getIdentityUrl(identity)

  return (
    <Group gap="xs" justify="space-between" w="100%">
      <Group gap="xs" w="100%" align="start" wrap="nowrap">
        <UiStack gap={0} align="center" w={50}>
          <PubkeyProtocolUiIdentityProviderIcon provider={identity.provider} />
          <Text size="xs" c="dimmed">
            {identity.provider.toString()}
          </Text>
        </UiStack>
        <UiStack gap={0} w="100%">
          <UiGroup>
            <UiAnchor to={url} target="_blank">
              <Text fw="bold">{identity.name}</Text>
            </UiAnchor>
            {action}
          </UiGroup>
          <Text ff="monospace" c="dimmed" size="xs">
            {ellipsify(identity.providerId.toString(), 8)}
          </Text>
          <Divider label="Verified by" labelPosition="left" my={4} />
          <UiStack gap="xs">
            {identity.communities?.map((x) => (
              <PubkeyProtocolUiCommunityLinkItem key={x.toString()} community={communityMap[x.toString()]} />
            ))}
          </UiStack>
        </UiStack>
      </Group>
    </Group>
  )
}
