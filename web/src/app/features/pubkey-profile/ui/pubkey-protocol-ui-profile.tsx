import { Group, Stack } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-protocol/anchor'
import { UiDebugModal } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { PubkeyProtocolUiProfileAnchor } from './pubkey-protocol-ui-profile-anchor'
import { PubkeyProtocolUiIdentity } from './pubkey-protocol-ui-identity'
import { PubkeyProtocolUiProfileAvatar } from './pubkey-protocol-ui-profile-avatar'

export function PubkeyProtocolUiProfile({
  children,
  profile,
  basePath,
}: {
  children?: ReactNode
  profile: PubKeyProfile
  basePath?: string
}) {
  return (
    <Group align="start" wrap="nowrap" justify="space-between" w="100%">
      <Group align="start" wrap="nowrap">
        <PubkeyProtocolUiProfileAvatar profile={profile} />
        <Stack gap={0}>
          <PubkeyProtocolUiProfileAnchor username={profile.username} basePath={basePath} />
          <Stack gap="xs">
            {profile.identities?.map((identity) => (
              <PubkeyProtocolUiIdentity identity={identity} key={identity.providerId} />
            ))}
          </Stack>
          {children}
        </Stack>
      </Group>
      <UiDebugModal data={profile} />
    </Group>
  )
}
