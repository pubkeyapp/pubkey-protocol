import { Group, Stack, Text } from '@mantine/core'
import { ellipsify, PubKeyIdentity } from '@pubkey-protocol/sdk'
import { UiAnchor, UiGroup, UiStack } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { usePubKeyProtocol } from '../../pubkey-protocol'
import { PubkeyProtocolUiIdentityProviderIcon } from './pubkey-protocol-ui-identity-provider-icon'
import { PubkeyProtocolUiIdentityVerifiedBy } from './pubkey-protocol-ui-identity-verified-by'

export function PubkeyProtocolUiIdentity({ action, identity }: { action?: ReactNode; identity: PubKeyIdentity }) {
  const { getIdentityUrl } = usePubKeyProtocol()
  const url = getIdentityUrl(identity)

  return (
    <Group w="100%" align="start" wrap="nowrap">
      <UiStack gap={0} align="center" w={50}>
        <PubkeyProtocolUiIdentityProviderIcon size={32} provider={identity.provider} />
        <Text size="xs" c="dimmed">
          {identity.provider.toString()}
        </Text>
      </UiStack>
      <Stack gap={4} style={{ flexGrow: 1 }}>
        <UiGroup>
          <UiAnchor to={url} target="_blank" size="lg" fw="bold">
            {identity.name}
          </UiAnchor>
          {action}
        </UiGroup>
        <Text ff="monospace" c="dimmed" size="xs">
          {ellipsify(identity.providerId.toString(), 8)}
        </Text>
        <PubkeyProtocolUiIdentityVerifiedBy communities={identity.communities ?? []} />
      </Stack>
    </Group>
  )
}
