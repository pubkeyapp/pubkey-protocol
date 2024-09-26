import { Group, Stack, Text } from '@mantine/core'
import { PubKeyIdentity } from '@pubkey-protocol/anchor'
import { UiAnchor } from '@pubkey-ui/core'
import { ellipsify } from '../../../ui'
import { PubkeyProtocolUiIdentityProviderIcon } from './pubkey-protocol-ui-identity-provider-icon'
import { usePubKeyProtocol } from '../../pubkey-protocol'

export function PubkeyProtocolUiIdentity({ identity }: { identity: PubKeyIdentity }) {
  const { getIdentityUrl } = usePubKeyProtocol()

  return (
    <Group gap="xs" wrap="nowrap">
      <PubkeyProtocolUiIdentityProviderIcon provider={identity.provider} />
      <Stack gap={0}>
        <UiAnchor to={getIdentityUrl(identity)}>
          <Text fw="bold" size="sm">
            {identity.name}
          </Text>
        </UiAnchor>
        <Text size="xs" c="dimmed">
          {ellipsify(identity.providerId, 10)}
        </Text>
      </Stack>
    </Group>
  )
}
