import { Group, Stack, Text } from '@mantine/core'
import { UiAnchor } from '@pubkey-ui/core'
import { useCluster } from '../../cluster/cluster-data-access'
import { PubKeyIdentity, PubKeyIdentityProvider } from '../data-access/pubkey-profile.types'

import { PubkeyProfileUiProvider } from './pubkey-profile-ui-provider'

export function useGetIdentityUrl(identity: PubKeyIdentity) {
  const { getExplorerUrl } = useCluster()

  switch (identity.provider) {
    case PubKeyIdentityProvider.Discord:
      return `https://discord.com/users/${identity.providerId}`
    case PubKeyIdentityProvider.Solana:
      return getExplorerUrl(`address/${identity.providerId}`)
    default:
      return undefined
  }
}

export function PubkeyProfileUiIdentity({ identity }: { identity: PubKeyIdentity }) {
  const to = useGetIdentityUrl(identity)

  return (
    <Group gap="xs">
      <PubkeyProfileUiProvider provider={identity.provider} />
      <Stack gap={0}>
        <UiAnchor to={to}>
          <Text fw="bold" size="sm">
            {identity.name}
          </Text>
        </UiAnchor>
        <Text size="xs" c="dimmed">
          {identity.providerId}
        </Text>
      </Stack>
    </Group>
  )
}
