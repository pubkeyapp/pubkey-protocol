import { Group, Stack, Text } from '@mantine/core'
import { PubKeyIdentity } from '../data-access/pubkey-profile.types'

import { PubkeyProfileUiProvider } from './pubkey-profile-ui-provider'

export function PubkeyProfileUiIdentity({ identity }: { identity: PubKeyIdentity }) {
  return (
    <Group gap="xs">
      <PubkeyProfileUiProvider provider={identity.provider} />
      <Stack gap={0}>
        <Text size="sm">{identity.name}</Text>
        <Text size="xs" c="dimmed">
          {identity.providerId}
        </Text>
      </Stack>
    </Group>
  )
}
