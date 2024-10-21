import { Divider, Group, Text } from '@mantine/core'
import { PubKeyIdentity } from '@pubkey-protocol/anchor'
import { ellipsify } from '@pubkey-protocol/sdk'
import { UiAnchor, UiGroup, UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { ReactNode } from 'react'
import { usePubKeyCommunity } from '../../pubkey-community/data-access'
import { PubkeyProtocolUiCommunityAvatarAnchor } from '../../pubkey-community/ui'
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
          <VerifiedBy communities={identity.communities ?? []} />
        </UiStack>
      </Group>
    </Group>
  )
}

export function VerifiedBy({ communities: communityIds }: { communities: PublicKey[] }) {
  const { communityMap } = usePubKeyCommunity()

  // map and sort the communities by name
  const communities = communityIds
    .map((id) => ({
      ...communityMap[id.toString()],
    }))
    .sort((a, b) => (a.name > b.name ? 1 : -1))

  return (
    <UiStack gap={0} w="100%">
      <Divider label="Verified by" labelPosition="left" my={4} />
      <Group gap="xs">
        {communities.map((community) => {
          return (
            <PubkeyProtocolUiCommunityAvatarAnchor
              key={community.slug}
              community={community}
              to={`/communities/${community.slug}`}
            />
          )
        })}
      </Group>
    </UiStack>
  )
}
