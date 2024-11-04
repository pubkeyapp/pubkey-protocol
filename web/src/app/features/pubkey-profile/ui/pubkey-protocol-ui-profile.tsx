import { Group, Stack, Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { UiCard, UiDebugModal } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'
import { PubkeyProtocolUiProfileAnchor } from './pubkey-protocol-ui-profile-anchor'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'
import { PubkeyProtocolUiProfileBio } from './pubkey-protocol-ui-profile-bio'

export function PubkeyProtocolUiProfile({
  children,
  profile,
  to,
}: {
  children?: ReactNode
  profile: PubKeyProfile
  to?: string
}) {
  return (
    <Group align="start" wrap="nowrap" justify="space-between" w="100%">
      <Group align="start" wrap="nowrap">
        <PubkeyProtocolUiProfileAvatar profile={profile} />
        <Stack gap={0}>
          <PubkeyProtocolUiProfileAnchor profile={profile} to={to} />
          <Text size="xs" c="dimmed">
            {profile.username}
          </Text>
          <Group mt="md">
            <PubkeyProtocolUiProfileBio profile={profile} />
          </Group>
          <Stack gap="xs" mt="md">
            {profile.identities?.map((identity) => (
              <UiCard key={`${identity.provider}-${identity.providerId}`}>
                <PubkeyProtocolUiIdentity identity={identity} key={identity.providerId} />
              </UiCard>
            ))}
          </Stack>
          {children}
        </Stack>
      </Group>
      <UiDebugModal data={profile} />
    </Group>
  )
}
